from fastapi import APIRouter, Depends

from chat.modules import (
    clear_chat_history,
    create_chat,
    delete_chat,
    get_all_chat,
    update_chat,
)
from chat.scheme import ChatCreate, ChatResponse, ChatUpdate
from user.modules import get_current_user

router = APIRouter(prefix="/chats", tags=["chats"])


@router.post("/", response_model=ChatResponse)
async def create_new_chat(
    chat_data: ChatCreate, current_user: dict = Depends(get_current_user)
):
    return await create_chat(chat_data, current_user)


@router.delete("/{chat_id}")
async def delete_existing_chat(
    chat_id: int, current_user: dict = Depends(get_current_user)
):
    return await delete_chat(chat_id, current_user)


@router.get("/", response_model=list[ChatResponse])
async def list_user_chats(current_user: dict = Depends(get_current_user)):
    """Возвращает все чаты текущего пользователя."""
    return await get_all_chat(current_user)


@router.patch("/{chat_id}", response_model=ChatResponse)
async def update_chat_title(
    chat_id: int,
    chat_data: ChatUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Обновляет название (title) чата."""
    return await update_chat(chat_id, chat_data, current_user)


@router.delete("/{chat_id}/messages")
async def clear_existing_chat_history(
    chat_id: int, current_user: dict = Depends(get_current_user)
):
    """Удаляет всю историю сообщений конкретного чата."""
    return await clear_chat_history(chat_id, current_user)
