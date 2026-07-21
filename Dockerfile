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

# Запускаем миграции Alembic и запускаем сервер Uvicorn
CMD ["sh", "-c", "alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 8000"]
