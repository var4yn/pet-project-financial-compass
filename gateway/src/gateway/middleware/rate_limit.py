import time
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, requests_per_minute: int = 60):
        super().__init__(app)
        self.rpm = requests_per_minute
        self.requests: dict[str, list[float]] = {}

    async def dispatch(self, request: Request, call_next) -> Response:
        if request.url.path == "/health":
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        minute_ago = now - 60

        self.requests[client_ip] = [
            t for t in self.requests.get(client_ip, []) if t > minute_ago
        ]

        if len(self.requests[client_ip]) >= self.rpm:
            return JSONResponse(
                status_code=429, content={"detail": "Too many requests"}
            )

        self.requests[client_ip].append(now)
        return await call_next(request)
