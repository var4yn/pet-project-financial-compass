from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from uuid import uuid4

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum as SQLEnum,
    ForeignKey,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from transactions_service.database import Base


class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4())
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    type: Mapped[TransactionType] = mapped_column(
        SQLEnum(TransactionType), nullable=False
    )
    icon: Mapped[str | None] = mapped_column(String(50))
    color: Mapped[str | None] = mapped_column(String(7))
    user_id: Mapped[str] = mapped_column(UUID(as_uuid=False), index=True)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    transactions: Mapped[list["Transaction"]] = relationship(back_populates="category")


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), index=True, nullable=False
    )
    category_id: Mapped[str] = mapped_column(
        ForeignKey("categories.id"), nullable=False
    )
    type: Mapped[TransactionType] = mapped_column(
        SQLEnum(TransactionType), nullable=False
    )
    amount: Mapped[Decimal] = mapped_column(
        Numeric(precision=12, scale=2), nullable=False
    )
    currency: Mapped[str] = mapped_column(String(3), default="RUB")
    description: Mapped[str | None] = mapped_column(Text)
    transaction_date: Mapped[date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    category: Mapped[Category] = relationship(back_populates="transactions")
