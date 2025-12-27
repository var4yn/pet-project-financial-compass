from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from transactions_service.repositories.transaction import CategoryRepository, TransactionRepository
from transactions_service.schemas.transaction import (
    CategoryCreate,
    CategoryResponse,
    PaginatedTransactions,
    TransactionCreate,
    TransactionFilter,
    TransactionResponse,
    TransactionUpdate,
)


class TransactionService:
    def __init__(self, session: AsyncSession):
        self.transaction_repo = TransactionRepository(session)
        self.category_repo = CategoryRepository(session)

    async def create_transaction(self, user_id: str, data: TransactionCreate) -> TransactionResponse:
        category = await self.category_repo.get_by_id(data.category_id, user_id)
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
        transaction = await self.transaction_repo.create(user_id, data)
        return TransactionResponse.model_validate(transaction)

    async def get_transactions(
        self,
        user_id: str,
        filters: TransactionFilter | None = None,
        page: int = 1,
        size: int = 20,
    ) -> PaginatedTransactions:
        transactions, total = await self.transaction_repo.get_all(user_id, filters, page, size)
        return PaginatedTransactions(
            items=[TransactionResponse.model_validate(t) for t in transactions],
            total=total,
            page=page,
            size=size,
            pages=(total + size - 1) // size if total > 0 else 0,
        )

    async def get_transaction(self, user_id: str, transaction_id: str) -> TransactionResponse:
        transaction = await self.transaction_repo.get_by_id(transaction_id, user_id)
        if not transaction:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
        return TransactionResponse.model_validate(transaction)

    async def update_transaction(
        self, user_id: str, transaction_id: str, data: TransactionUpdate
    ) -> TransactionResponse:
        transaction = await self.transaction_repo.get_by_id(transaction_id, user_id)
        if not transaction:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
        if data.category_id:
            category = await self.category_repo.get_by_id(data.category_id, user_id)
            if not category:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
        updated = await self.transaction_repo.update(transaction, data)
        return TransactionResponse.model_validate(updated)

    async def delete_transaction(self, user_id: str, transaction_id: str) -> None:
        transaction = await self.transaction_repo.get_by_id(transaction_id, user_id)
        if not transaction:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
        await self.transaction_repo.delete(transaction)


class CategoryService:
    def __init__(self, session: AsyncSession):
        self.category_repo = CategoryRepository(session)

    async def get_categories(self, user_id: str) -> list[CategoryResponse]:
        categories = await self.category_repo.get_all(user_id)
        if not categories:
            categories = await self.category_repo.create_defaults(user_id)
        return [CategoryResponse.model_validate(c) for c in categories]

    async def create_category(self, user_id: str, data: CategoryCreate) -> CategoryResponse:
        category = await self.category_repo.create(user_id, data)
        return CategoryResponse.model_validate(category)