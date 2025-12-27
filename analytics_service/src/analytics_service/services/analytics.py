from datetime import date
from decimal import Decimal

import httpx
from fastapi import HTTPException, status

from analytics_service.config import settings
from analytics_service.schemas.analytics import (
    AnalyticsReport,
    CategorySummary,
    MonthlyTrend,
    PeriodSummary,
)


class AnalyticsService:
    def __init__(self, access_token: str):
        self.headers = {"Authorization": f"Bearer {access_token}"}

    async def _fetch_transactions(self, date_from: date, date_to: date) -> list[dict]:
        params = {
            "date_from": date_from.isoformat(),
            "date_to": date_to.isoformat(),
            "size": 1000,
        }
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{settings.transactions_service_url}/api/v1/transactions",
                    headers=self.headers,
                    params=params,
                    timeout=10.0,
                )
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail="Failed to fetch transactions",
                    )
                return response.json().get("items", [])
            except httpx.RequestError:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Transactions service unavailable",
                )

    async def get_report(self, date_from: date, date_to: date) -> AnalyticsReport:
        transactions = await self._fetch_transactions(date_from, date_to)

        total_income = Decimal("0")
        total_expense = Decimal("0")
        expense_by_cat: dict[str, dict] = {}
        income_by_cat: dict[str, dict] = {}
        monthly_data: dict[str, dict] = {}

        for t in transactions:
            amount = Decimal(str(t["amount"]))
            t_type = t["type"]
            category = t.get("category", {})
            t_date = date.fromisoformat(t["transaction_date"])
            month_key = t_date.strftime("%Y-%m")

            if t_type == "income":
                total_income += amount
                cat_dict = income_by_cat
            else:
                total_expense += amount
                cat_dict = expense_by_cat

            cat_id = t["category_id"]
            if cat_id not in cat_dict:
                cat_dict[cat_id] = {
                    "category_id": cat_id,
                    "category_name": category.get("name", "Unknown"),
                    "category_icon": category.get("icon"),
                    "category_color": category.get("color"),
                    "total_amount": Decimal("0"),
                    "transaction_count": 0,
                }
            cat_dict[cat_id]["total_amount"] += amount
            cat_dict[cat_id]["transaction_count"] += 1

            if month_key not in monthly_data:
                monthly_data[month_key] = {
                    "month": month_key,
                    "income": Decimal("0"),
                    "expense": Decimal("0"),
                }
            if t_type == "income":
                monthly_data[month_key]["income"] += amount
            else:
                monthly_data[month_key]["expense"] += amount

        # Calculate percentages
        for cat in expense_by_cat.values():
            cat["percentage"] = (
                float(cat["total_amount"] / total_expense * 100)
                if total_expense > 0
                else 0.0
            )
        for cat in income_by_cat.values():
            cat["percentage"] = (
                float(cat["total_amount"] / total_income * 100)
                if total_income > 0
                else 0.0
            )

        monthly_trends = [
            MonthlyTrend(
                month=d["month"],
                income=d["income"],
                expense=d["expense"],
                balance=d["income"] - d["expense"],
            )
            for d in sorted(monthly_data.values(), key=lambda x: x["month"])
        ]

        return AnalyticsReport(
            summary=PeriodSummary(
                period_start=date_from,
                period_end=date_to,
                total_income=total_income,
                total_expense=total_expense,
                balance=total_income - total_expense,
                transaction_count=len(transactions),
            ),
            expense_by_category=[
                CategorySummary(**c)
                for c in sorted(
                    expense_by_cat.values(),
                    key=lambda x: x["total_amount"],
                    reverse=True,
                )
            ],
            income_by_category=[
                CategorySummary(**c)
                for c in sorted(
                    income_by_cat.values(),
                    key=lambda x: x["total_amount"],
                    reverse=True,
                )
            ],
            monthly_trends=monthly_trends,
        )
