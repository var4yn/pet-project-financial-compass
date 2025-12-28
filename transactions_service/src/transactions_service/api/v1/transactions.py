from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from transactions_service.api.deps import CurrentUserId, DBSession
from transactions_service.models.transaction import TransactionType
from transactions_service.schemas.transaction import (
    CategoryCreate,
    CategoryResponse,
    PaginatedTransactions,
    TransactionCreate,
    TransactionFilter,
    TransactionResponse,
    TransactionUpdate,
)
from transactions_service.services.transaction import CategoryService, TransactionService

router = APIRouter(tags=["Transactions"])


@router.post("/transactions", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(data: TransactionCreate, user_id: CurrentUserId, session: DBSession):
    return await TransactionService(session).create_transaction(user_id, data)


@router.get("/transactions", response_model=PaginatedTransactions)
async def get_transactions(
    user_id: CurrentUserId,
    session: DBSession,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=1000),
    
    type: TransactionType | None = Query(None, description="Фильтр по типу"),
    category_id: str | None = Query(None, description="Фильтр по категории"),
    date_from: date | None = Query(None, description="Дата от"),
    date_to: date | None = Query(None, description="Дата до"),
):
    filters = TransactionFilter(
        type=type,
        category_id=category_id,
        date_from=date_from,
        date_to=date_to,
    )
    return await TransactionService(session).get_transactions(user_id, filters, page, size)


@router.get("/transactions/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(transaction_id: str, user_id: CurrentUserId, session: DBSession):
    return await TransactionService(session).get_transaction(user_id, transaction_id)


@router.patch("/transactions/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: str, data: TransactionUpdate, user_id: CurrentUserId, session: DBSession
):
    return await TransactionService(session).update_transaction(user_id, transaction_id, data)


@router.delete("/transactions/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(transaction_id: str, user_id: CurrentUserId, session: DBSession):
    await TransactionService(session).delete_transaction(user_id, transaction_id)


@router.get("/categories", response_model=list[CategoryResponse])
async def get_categories(user_id: CurrentUserId, session: DBSession):
    return await CategoryService(session).get_categories(user_id)


@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(data: CategoryCreate, user_id: CurrentUserId, session: DBSession):
    return await CategoryService(session).create_category(user_id, data)