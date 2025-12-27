from datetime import date
from decimal import Decimal
from pydantic import BaseModel


class PeriodSummary(BaseModel):
    period_start: date
    period_end: date
    total_income: Decimal
    total_expense: Decimal
    balance: Decimal
    transaction_count: int


class CategorySummary(BaseModel):
    category_id: str
    category_name: str
    category_icon: str | None
    category_color: str | None
    total_amount: Decimal
    transaction_count: int
    percentage: float


class MonthlyTrend(BaseModel):
    month: str
    income: Decimal
    expense: Decimal
    balance: Decimal


class AnalyticsReport(BaseModel):
    summary: PeriodSummary
    expense_by_category: list[CategorySummary]
    income_by_category: list[CategorySummary]
    monthly_trends: list[MonthlyTrend]
