from fastapi import APIRouter, Request, Response
import httpx

from gateway.config import settings

router = APIRouter(tags=["Transactions"])


async def proxy(request: Request, path: str, method: str) -> Response:
    async with httpx.AsyncClient() as client:
        headers = {k: v for k, v in request.headers.items() if k.lower() != "host"}
        body = await request.body() if method in ("POST", "PUT", "PATCH") else None

        response = await client.request(
            method=method,
            url=f"{settings.transactions_service_url}/api/v1{path}",
            headers=headers,
            content=body,
            params=dict(request.query_params),
            timeout=10.0,
        )
        return Response(
            content=response.content,
            status_code=response.status_code,
            media_type=response.headers.get("content-type"),
        )


@router.api_route(
    "/transactions{path:path}", methods=["GET", "POST", "PATCH", "DELETE"]
)
async def transactions_proxy(request: Request, path: str = ""):
    return await proxy(request, f"/transactions{path}", request.method)


@router.api_route("/categories{path:path}", methods=["GET", "POST"])
async def categories_proxy(request: Request, path: str = ""):
    return await proxy(request, f"/categories{path}", request.method)
