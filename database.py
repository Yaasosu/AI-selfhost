import os

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

load_dotenv()

db_host = os.getenv("test_DB_HOST")
db_port = os.getenv("test_DB_PORT")
db_user = os.getenv("test_DB_USER")
db_pass = os.getenv("test_DB_PASS")
db_name = os.getenv("test_DB_NAME")

DATABASE_URL = f"postgresql+asyncpg://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"

# 1. Create the async engine
engine = create_async_engine(DATABASE_URL, echo=True)

# 2. Setup the session maker factory
async_session_local = async_sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)


class Base(DeclarativeBase):
    pass
