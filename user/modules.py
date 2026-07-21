import os
from datetime import UTC, datetime, timedelta

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from argon2.low_level import Type
from fastapi import HTTPException, Request
from sqlalchemy import select

from database import async_session_local
from user.model import User
from user.scheme import UserCreate

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")


ph = PasswordHasher(type=Type.ID)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES))

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def hash_password(password: str) -> str:
    return ph.hash(password)


async def register_user(scheme: UserCreate):
    async with async_session_local() as session:
        # Сравниваем с name в схеме (с маленькой буквы)
        query = select(User).where(User.name == scheme.name)
        result = await session.execute(query)
        existing_user = result.scalar_one_or_none()

        if existing_user is not None:
            raise HTTPException(status_code=400, detail="User already exists")

        hashed_pw = hash_password(scheme.password)
        new_user = User(name=scheme.name, password=hashed_pw)

        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)  # Получаем сгенерированный ID пользователя

        return {
            "message": "User registered successfully",
            "user_id": new_user.id,
            "name": new_user.name,
        }


async def login_user(scheme: UserCreate):
    async with async_session_local() as session:
        query = select(User).where(User.name == scheme.name)
        result = await session.execute(query)
        user = result.scalar_one_or_none()

        if user is None:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        try:
            ph.verify(user.password, scheme.password)
            user_payload = {  # jwt кал
                "user_sub": str(user.id),
                "name": user.name,
            }
            token = create_access_token(data=user_payload)
            return {
                "access_token": token,
                "token_type": "bearer",
            }  # возращаем acces и потом передаем в куку

        except VerifyMismatchError:
            raise HTTPException(status_code=401, detail="Invalid username or password")


async def get_current_user(request: Request):
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_sub")
        name = payload.get("name")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"user": name, "user_id": user_id}

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
