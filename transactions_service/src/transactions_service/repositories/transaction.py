from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from transactions_service.models.transaction import Category, Transaction, TransactionType
from transactions_service.schemas.transaction import (
    CategoryCreate,
    TransactionCreate,
    TransactionFilter,
    TransactionUpdate,
)


class CategoryRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, category_id: str, user_id: str) -> Category | None:
        result = await self.session.execute(
            select(Category).where(
                and_(Category.id == category_id, Category.user_id == user_id)
            )
        )
        return result.scalar_one_or_none()

    async def get_all(self, user_id: str) -> list[Category]:
        result = await self.session.execute(
            select(Category).where(Category.user_id == user_id)
        )
        return list(result.scalars().all())

    async def create(self, user_id: str, data: CategoryCreate) -> Category:
        category = Category(user_id=user_id, **data.model_dump())
        self.session.add(category)
        await self.session.flush()
        await self.session.refresh(category)
        return category

    async def create_defaults(self, user_id: str) -> list[Category]:
        defaults = [
            {"name": "Зарплата", "type": TransactionType.INCOME, "icon": "💰", "color": "#4CAF50"},
            {"name": "Продукты", "type": TransactionType.EXPENSE, "icon": "🛒", "color": "#FF9800"},
            {"name": "Транспорт", "type": TransactionType.EXPENSE, "icon": "🚗", "color": "#2196F3"},
            {"name": "Развлечения", "type": TransactionType.EXPENSE, "icon": "🎬", "color": "#9C27B0"},
        ]
        categories = []
        for d in defaults:
            category = Category(user_id=user_id, is_default=True, **d)
            self.session.add(category)
            categories.append(category)
        await self.session.flush()
        return categories


class TransactionRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, transaction_id: str, user_id: str) -> Transaction | None:
        result = await self.session.execute(
            select(Transaction)
            .options(selectinload(Transaction.category))
            .where(and_(Transaction.id == transaction_id, Transaction.user_id == user_id))
        )
        return result.scalar_one_or_none()

    async def get_all(
        self,
        user_id: str,
        filters: TransactionFilter | None = None,
        page: int = 1,
        size: int = 20,
    ) -> tuple[list[Transaction], int]:
        query = (
            select(Transaction)
            .options(selectinload(Transaction.category))
            .where(Transaction.user_id == user_id)
        )

        if filters:
            if filters.type:
                query = query.where(Transaction.type == filters.type)
            if filters.category_id:
                query = query.where(Transaction.category_id == filters.category_id)
            if filters.date_from:
                query = query.where(Transaction.transaction_date >= filters.date_from)
            if filters.date_to:
                query = query.where(Transaction.transaction_date <= filters.date_to)

        count_query = select(func.count()).select_from(query.subquery())
        total = (await self.session.execute(count_query)).scalar() or 0

        query = (
            query.order_by(Transaction.transaction_date.desc())
            .offset((page - 1) * size)
            .limit(size)
        )
        result = await self.session.execute(query)
        return list(result.scalars().all()), total

    async def create(self, user_id: str, data: TransactionCreate) -> Transaction:
        transaction = Transaction(user_id=user_id, **data.model_dump())
        self.session.add(transaction)
        await self.session.flush()
        await self.session.refresh(transaction, ["category"])
        return transaction

    async def update(self, transaction: Transaction, data: TransactionUpdate) -> Transaction:
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(transaction, key, value)
        await self.session.flush()
        await self.session.refresh(transaction, ["category"])
        return transaction

    async def delete(self, transaction: Transaction) -> None:
        await self.session.delete(transaction)
        await self.session.flush()