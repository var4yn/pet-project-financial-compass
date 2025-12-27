from fastapi import APIRouter, Request, Response
import httpx

from gateway.config import settings

router = APIRouter(prefix="/analytics", tags=["Analytics"])


async def proxy(request: Request, path: str) -> Response:
    async with httpx.AsyncClient() as client:
        headers = {k: v for k, v in request.headers.items() if k.lower() != "host"}

        response = await client.get(
            f"{settings.analytics_service_url}/api/v1/analytics{path}",
            headers=headers,
            params=dict(request.query_params),
            timeout=30.0,
        )
        return Response(
            content=response.content,
            status_code=response.status_code,
            media_type=response.headers.get("content-type"),
        )


@router.get("/report")
async def get_report(request: Request):
    return await proxy(request, "/report")


@router.get("/summary")
async def get_summary(request: Request):
    return await proxy(request, "/summary")
