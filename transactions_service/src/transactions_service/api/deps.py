from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import httpx
from sqlalchemy.ext.asyncio import AsyncSession

from transactions_service.config import settings
from transactions_service.database import get_async_session

security = HTTPBearer()


async def verify_token(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
) -> dict:
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{settings.auth_service_url}/api/v1/auth/verify-token",
                headers={"Authorization": f"Bearer {credentials.credentials}"},
                timeout=5.0,
            )
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid or expired token",
                )
            return response.json()
        except httpx.RequestError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Auth service unavailable",
            )


async def get_current_user_id(token_data: Annotated[dict, Depends(verify_token)]) -> str:
    return token_data["user_id"]


CurrentUserId = Annotated[str, Depends(get_current_user_id)]
DBSession = Annotated[AsyncSession, Depends(get_async_session)]