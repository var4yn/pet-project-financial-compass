from datetime import datetime, timedelta, UTC

from jose import JWTError, jwt

from auth_service.config import settings
from auth_service.schemas.user import TokenPair, TokenPayload


class JWTService:
    def __init__(self):
        self.secret_key = settings.jwt_secret_key
        self.algorithm = settings.jwt_algorithm
        self.access_expire = settings.access_token_expire_minutes
        self.refresh_expire = settings.refresh_token_expire_days

    def create_access_token(self, user_id: str) -> str:
        expire = datetime.now(UTC) + timedelta(minutes=self.access_expire)
        payload = {"sub": user_id, "exp": expire, "type": "access"}
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

    def create_refresh_token(self, user_id: str) -> str:
        expire = datetime.now(UTC) + timedelta(days=self.refresh_expire)
        payload = {"sub": user_id, "exp": expire, "type": "refresh"}
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

    def create_token_pair(self, user_id: str) -> TokenPair:
        return TokenPair(
            access_token=self.create_access_token(user_id),
            refresh_token=self.create_refresh_token(user_id),
        )

    def verify_token(self, token: str, token_type: str = "access") -> TokenPayload | None:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            if payload.get("type") != token_type:
                return None
            return TokenPayload(**payload)
        except JWTError:
            return None


jwt_service = JWTService()