import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi.staticfiles import StaticFiles
from prometheus_fastapi_instrumentator import Instrumentator, metrics
from redis import asyncio as aioredis
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from chat.router import router as chat_router
from message.router import router as message_router
from user.router import limiter as user_limiter
from user.router import router as user_router

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")

    redis_cache = aioredis.from_url(redis_url)
    FastAPICache.init(RedisBackend(redis_cache), prefix="fastapi-cache")

    yield

    await redis_cache.close()


app = FastAPI(lifespan=lifespan)
# лимиты
app.state.limiter = user_limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

instrumentator = Instrumentator(
    should_group_status_codes=False,
    should_ignore_untemplated=True,
    should_respect_env_var=False,
    excluded_handlers=[".*admin.*", "/metrics"],
)

# Добавляем стандартные или кастомные метрики по выбору
instrumentator.add(metrics.request_size(metric_name="http_request_size_bytes"))
instrumentator.add(metrics.response_size(metric_name="http_response_size_bytes"))
instrumentator.add(metrics.latency(metric_name="http_request_duration_seconds"))

instrumentator.instrument(app).expose(app, endpoint="/metrics")

app.include_router(user_router)
app.include_router(chat_router)
app.include_router(message_router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
def read_root():
    return {"message": "everything is good!"}
