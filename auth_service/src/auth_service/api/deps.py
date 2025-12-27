from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from auth_service.database import get_async_session
from auth_service.repositories.user import UserRepository
from auth_service.schemas.user import UserResponse
from auth_service.services.jwt import jwt_service

security = HTTPBearer()


async def get_current_user(
        credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
        session: Annotated[AsyncSession, Depends(get_async_session)],
) -> UserResponse:
    payload = jwt_service.verify_token(credentials.credentials, token_type="access")
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user_repo = UserRepository(session)
    user = await user_repo.get_by_id(payload.sub)

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    return UserResponse.model_validate(user)


CurrentUser = Annotated[UserResponse, Depends(get_current_user)]
DBSession = Annotated[AsyncSession, Depends(get_async_session)]