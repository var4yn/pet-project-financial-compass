from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from analytics_service.api.v1.analytics import router
from analytics_service.database import engine
from analytics_service.services.cache import cache_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await cache_service.close()
    await engine.dispose()


app = FastAPI(
    title="Analytics Service",
    description="Financial analytics and reporting",
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
    return {"status": "healthy", "service": "analytics-service"}
