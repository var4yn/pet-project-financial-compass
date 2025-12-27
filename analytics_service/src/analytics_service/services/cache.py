import json
from datetime import timedelta

import redis.asyncio as redis

from analytics_service.config import settings


class CacheService:
    def __init__(self):
        self.redis = redis.from_url(settings.redis_url)
        self.default_ttl = timedelta(minutes=15)

    async def get(self, key: str) -> dict | None:
        data = await self.redis.get(key)
        return json.loads(data) if data else None

    async def set(self, key: str, value: dict, ttl: timedelta | None = None) -> None:
        await self.redis.set(
            key, json.dumps(value, default=str), ex=ttl or self.default_ttl
        )

    async def close(self) -> None:
        await self.redis.close()

    def make_key(self, user_id: str, *args) -> str:
        return f"analytics:{user_id}:{':'.join(str(a) for a in args)}"


cache_service = CacheService()
