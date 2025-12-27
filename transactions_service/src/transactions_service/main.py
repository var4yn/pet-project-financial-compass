from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import redis.asyncio as redis

from transactions_service.api.v1.transactions import router
from transactions_service.config import settings
from transactions_service.database import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.redis = redis.from_url(settings.redis_url)
    yield
    await app.state.redis.close()
    await engine.dispose()


app = FastAPI(
    title="Transactions Service",
    description="Financial transactions management",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "transactions-service"}