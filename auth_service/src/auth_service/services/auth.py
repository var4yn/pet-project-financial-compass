from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from auth_service.repositories.user import UserRepository
from auth_service.schemas.user import TokenPair, UserCreate, UserLogin, UserResponse
from auth_service.services.jwt import jwt_service
from auth_service.utils.security import verify_password


class AuthService:
    def __init__(self, session: AsyncSession):
        self.user_repo = UserRepository(session)

    async def register(self, user_data: UserCreate) -> UserResponse:
        existing = await self.user_repo.get_by_email(user_data.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email already exists",
            )
        user = await self.user_repo.create(user_data)
        return UserResponse.model_validate(user)

    async def login(self, credentials: UserLogin) -> TokenPair:
        user = await self.user_repo.get_by_email(credentials.email)
        if not user or not verify_password(credentials.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is disabled",
            )
        return jwt_service.create_token_pair(user.id)

    async def refresh_tokens(self, refresh_token: str) -> TokenPair:
        payload = jwt_service.verify_token(refresh_token, token_type="refresh")
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )
        user = await self.user_repo.get_by_id(payload.sub)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive",
            )
        return jwt_service.create_token_pair(user.id)

    async def get_current_user(self, user_id: str) -> UserResponse:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return UserResponse.model_validate(user)