from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from transactions_service.models.transaction import TransactionType


class CategoryBase(BaseModel):
    name: str = Field(..., max_length=100)
    type: TransactionType
    icon: str | None = None
    color: str | None = Field(None, pattern=r"^#[0-9A-Fa-f]{6}$")


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    user_id: str
    is_default: bool
    created_at: datetime


class TransactionBase(BaseModel):
    category_id: str
    type: TransactionType
    amount: Decimal = Field(..., gt=0, decimal_places=2)
    currency: str = Field(default="RUB", max_length=3)
    description: str | None = None
    transaction_date: date


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    category_id: str | None = None
    amount: Decimal | None = Field(None, gt=0, decimal_places=2)
    description: str | None = None
    transaction_date: date | None = None


class TransactionResponse(TransactionBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    category: CategoryResponse | None = None


class TransactionFilter(BaseModel):
    type: TransactionType | None = None
    category_id: str | None = None
    date_from: date | None = None
    date_to: date | None = None


class PaginatedTransactions(BaseModel):
    items: list[TransactionResponse]
    total: int
    page: int
    size: int
    pages: int
