from fastapi import HTTPException
from sqlalchemy import delete, select

from chat.model import Chat
from chat.scheme import ChatCreate, ChatUpdate
from database import async_session_local
from message.model import Message


async def create_chat(chat_data: ChatCreate, current_user: dict) -> Chat:
    async with async_session_local() as session:
        user_id = int(current_user["user_id"])
        new_chat = Chat(title=chat_data.title or "New Chat", user_id=user_id)
        session.add(new_chat)
        await session.commit()
        await session.refresh(new_chat)
        return new_chat


async def delete_chat(chat_id: int, current_user: dict) -> dict:
    async with async_session_local() as session:
        user_id = int(current_user["user_id"])

        query = select(Chat).where(Chat.id == chat_id)
        result = await session.execute(query)
        chat = result.scalar_one_or_none()

        if chat is None:
            raise HTTPException(status_code=404, detail="Chat not found")

        if chat.user_id != user_id:
            raise HTTPException(
                status_code=403, detail="Access denied to delete this chat"
            )

        await session.delete(chat)
        await session.commit()

        return {"message": "Chat successfully deleted"}


async def get_all_chat(current_user: dict) -> dict:
    async with async_session_local() as session:
        user_id = int(current_user["user_id"])

        query = select(Chat).where(Chat.user_id == user_id).order_by(Chat.id.desc())
        result = await session.execute(query)
        chats = result.scalars().all()

        return chats


async def update_chat(chat_id: int, chat_data: ChatUpdate, current_user: dict) -> Chat:
    async with async_session_local() as session:
        user_id = int(current_user["user_id"])

        query = select(Chat).where(Chat.id == chat_id)
        result = await session.execute(query)
        chat = result.scalar_one_or_none()

        if chat is None:
            raise HTTPException(status_code=404, detail="Chat not found")

        if chat.user_id != user_id:
            raise HTTPException(
                status_code=403, detail="Access denied to edit this chat"
            )

        chat.title = chat_data.title
        await session.commit()
        await session.refresh(chat)
        return chat


async def clear_chat_history(chat_id: int, current_user: dict) -> dict:
    async with async_session_local() as session:
        user_id = int(current_user["user_id"])

        query = select(Chat).where(Chat.id == chat_id)
        result = await session.execute(query)
        chat = result.scalar_one_or_none()

        if chat is None:
            raise HTTPException(status_code=404, detail="Chat not found")

        if chat.user_id != user_id:
            raise HTTPException(
                status_code=403, detail="Access denied to clear history of this chat"
            )

        # Remove all messages from this chat
        delete_query = delete(Message).where(Message.chat_id == chat_id)
        await session.execute(delete_query)
        await session.commit()

        return {"message": "Chat history successfully cleared"}
