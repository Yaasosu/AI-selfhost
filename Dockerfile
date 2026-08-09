FROM python:3.12-alpine

WORKDIR /app

# Установка системных зависимостей для компиляции библиотек, если это необходимо
RUN apk add --no-cache gcc musl-dev libffi-dev postgresql-client

# Копируем файлы зависимостей
COPY pyproject.toml uv.lock ./

# Устанавливаем зависимости с помощью uv (быстрее и легче стандартного pip)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
RUN uv pip install --system -r pyproject.toml

# Копируем остальной код
COPY . .

# Экспонируем порт бэкенда
EXPOSE 8000

# Запускаем миграции Alembic и запускаем сервер Gunicorn с воркерами Uvicorn
CMD ["sh", "-c", "alembic upgrade head && gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000"]

