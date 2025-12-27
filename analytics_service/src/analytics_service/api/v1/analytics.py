from datetime import date, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from analytics_service.schemas.analytics import AnalyticsReport
from analytics_service.services.analytics import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])
security = HTTPBearer()


async def get_token(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
) -> str:
    return credentials.credentials


@router.get("/report", response_model=AnalyticsReport)
async def get_report(
    token: Annotated[str, Depends(get_token)],
    date_from: date = Query(default_factory=lambda: date.today() - timedelta(days=30)),
    date_to: date = Query(default_factory=date.today),
):
    """Get comprehensive analytics report for the specified period."""
    return await AnalyticsService(token).get_report(date_from, date_to)


@router.get("/summary")
async def get_summary(token: Annotated[str, Depends(get_token)]):
    """Get quick summary for current month."""
    today = date.today()
    first_day = today.replace(day=1)
    report = await AnalyticsService(token).get_report(first_day, today)
    return {
        "period": f"{first_day.isoformat()} - {today.isoformat()}",
        "total_income": report.summary.total_income,
        "total_expense": report.summary.total_expense,
        "balance": report.summary.balance,
        "top_expense_category": (
            report.expense_by_category[0].category_name
            if report.expense_by_category
            else None
        ),
    }
