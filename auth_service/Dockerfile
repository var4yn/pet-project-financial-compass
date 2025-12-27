FROM python:3.13-slim

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --frozen --no-dev

# Copy source code
COPY alembic.ini ./
COPY alembic ./alembic
COPY src ./src

ENV PYTHONPATH=/app/src
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Run migrations and start server
CMD ["sh", "-c", "uv run alembic upgrade head && uv run uvicorn auth_service.main:app --host 0.0.0.0 --port 8000"]