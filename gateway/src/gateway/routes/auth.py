from fastapi import APIRouter, Request, Response
import httpx

from gateway.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


async def proxy(request: Request, path: str, method: str = "GET") -> Response:
    async with httpx.AsyncClient() as client:
        headers = {k: v for k, v in request.headers.items() if k.lower() != "host"}
        body = await request.body() if method in ("POST", "PUT", "PATCH") else None

        response = await client.request(
            method=method,
            url=f"{settings.auth_service_url}/api/v1/auth{path}",
            headers=headers,
            content=body,
            timeout=10.0,
        )
        return Response(
            content=response.content,
            status_code=response.status_code,
            media_type=response.headers.get("content-type"),
        )


@router.post("/register")
async def register(request: Request):
    return await proxy(request, "/register", "POST")


@router.post("/login")
async def login(request: Request):
    return await proxy(request, "/login", "POST")


@router.post("/refresh")
async def refresh(request: Request):
    return await proxy(request, "/refresh", "POST")


@router.get("/me")
async def get_me(request: Request):
    return await proxy(request, "/me", "GET")
