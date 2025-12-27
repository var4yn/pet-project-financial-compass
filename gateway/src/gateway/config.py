from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    auth_service_url: str
    transactions_service_url: str
    analytics_service_url: str
    redis_url: str


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
