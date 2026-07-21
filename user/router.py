import os

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, Request, Response
from slowapi import Limiter
from slowapi.util import get_remote_address

from user.modules import get_current_user, login_user, register_user
from user.scheme import UserCreate

load_dotenv()

# для лимитов
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
limiter = Limiter(key_func=get_remote_address, storage_uri=redis_url)

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register")
@limiter.limit("1/2minutes")  # 1 запрос в 2 минуты
async def register(request: Request, user_data: UserCreate):
    return await register_user(user_data)


@router.post("/login")
async def login(user_data: UserCreate, response: Response):
    result = await login_user(user_data)

    response.set_cookie(
        key="access_token",
        value=result["access_token"],
        httponly=True,  # что бы не спиздили
        max_age=3200,
        samesite="lax",  # Защита от CSRF-атак
        secure=False,  # true если https
    )

    return {"message": "Login successful"}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        samesite="lax",
        secure=False,
    )
    return {"message": "Logout successful"}


@router.get("/me")
async def get_me(user: dict = Depends(get_current_user)):
    return user
