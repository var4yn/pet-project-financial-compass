from fastapi import APIRouter, status

from auth_service.api.deps import CurrentUser, DBSession
from auth_service.schemas.user import (
    RefreshTokenRequest,
    TokenPair,
    UserCreate,
    UserLogin,
    UserResponse,
)
from auth_service.services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, session: DBSession):
    """Register a new user."""
    service = AuthService(session)
    return await service.register(user_data)


@router.post("/login", response_model=TokenPair)
async def login(credentials: UserLogin, session: DBSession):
    """Login and get access tokens."""
    service = AuthService(session)
    return await service.login(credentials)


@router.post("/refresh", response_model=TokenPair)
async def refresh_tokens(body: RefreshTokenRequest, session: DBSession):
    """Refresh access token."""
    service = AuthService(session)
    return await service.refresh_tokens(body.refresh_token)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: CurrentUser):
    """Get current user info."""
    return current_user


@router.post("/verify-token")
async def verify_token(current_user: CurrentUser):
    """Verify token - for internal service use."""
    return {
        "valid": True,
        "user_id": current_user.id,
        "email": current_user.email,
    }