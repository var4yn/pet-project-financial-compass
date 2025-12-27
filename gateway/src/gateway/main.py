from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import redis.asyncio as redis

from gateway.config import settings
from gateway.middleware.rate_limit import RateLimitMiddleware
from gateway.routes import analytics, auth, transactions


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.redis = redis.from_url(settings.redis_url)
    yield
    await app.state.redis.close()


app = FastAPI(
    title="Financial Compass API Gateway",
    description="Unified API Gateway",
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
app.add_middleware(RateLimitMiddleware)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(transactions.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "gateway"}


@app.get("/")
async def root():
    return {
        "message": "Financial Compass API",
        "docs": "/docs",
        "services": ["auth", "transactions", "analytics"],
    }
