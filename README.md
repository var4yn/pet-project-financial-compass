

## Создание автомиграции
```
docker-compose run --rm auth-service uv run alembic revision --autogenerate -m "add_user_avatar"

docker-compose run --rm transactions-service uv run alembic revision --autogenerate -m "add_recurring_transactions"

docker-compose run --rm analytics-service uv run alembic revision --autogenerate -m "add_budget_table"

```