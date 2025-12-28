
## Запуск проекта

Сначала нужно клонировать репозиторий и перейти в склонированную папку. Затем выполнить команды:

```
cp .env.example .env

cd frontend

cp .env.example .env

cd ..

docker compose build

docker compose run --rm auth-service uv run alembic revision --autogenerate -m "init auth"

docker compose run --rm transactions-service uv run alembic revision --autogenerate -m "init transactions"

docker compose run --rm analytics-service uv run alembic revision --autogenerate -m "init analytics"

docker compose up

# проверить API
curl http://localhost/api/health

```


## Создание автомиграции
```
docker compose run --rm auth-service uv run alembic revision --autogenerate -m "add_user_avatar"

docker compose run --rm transactions-service uv run alembic revision --autogenerate -m "add_recurring_transactions"

docker compose run --rm analytics-service uv run alembic revision --autogenerate -m "add_budget_table"

```