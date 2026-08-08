import asyncio
import json
import time

from fastapi import HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi_cache.decorator import cache
from ollama import AsyncClient
from sqlalchemy import select

from chat.model import Chat
from database import async_session_local
from message.model import Message
from message.scheme import MessageCreate

# Create a single client for reuse
client = AsyncClient()


@cache(expire=30)
async def get_available_models() -> dict:
    print("!!! DIRECT REQUEST TO OLLAMA (BYPASS CACHE) !!!")
    try:
        response = await client.list()
        models_dict = {
            str(i): model.model for i, model in enumerate(response.models, start=1)
        }
        return models_dict
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve model list from Ollama: {str(e)}",
        )


async def send_message_stream(
    message: MessageCreate, request: Request, current_user: dict
):
    async with async_session_local() as session:
        chat_query = select(Chat).where(Chat.id == message.chat_id)
        chat_result = await session.execute(chat_query)
        chat = chat_result.scalar_one_or_none()
        if chat is None:
            raise HTTPException(status_code=404, detail="Chat not found")

        user_id = int(current_user["user_id"])
        if chat.user_id != user_id:
            raise HTTPException(
                status_code=403, detail="Access denied to send messages in this chat"
            )

        user_msg = Message(
            chat_id=message.chat_id,
            sender="user",
            text=message.text,
            created_at=int(time.time()),
            ai=message.ai,
        )
        session.add(user_msg)
        await session.commit()

        models = await get_available_models()
        if str(message.ai) not in models:
            raise HTTPException(status_code=400, detail="Invalid model ID")
        selected_model_name = models[str(message.ai)]

        # Sent message metric
        from metrics import MESSAGES_SENT_TOTAL

        MESSAGES_SENT_TOTAL.labels(
            user_id=str(user_id), ai_model=selected_model_name
        ).inc()

        messages_query = (
            select(Message)
            .where(Message.chat_id == message.chat_id)
            .order_by(Message.id)
        )

        messages_result = await session.execute(messages_query)
        db_messages = messages_result.scalars().all()

        # If this is the first message in the chat, update chat title
        if len(db_messages) == 1:
            words = message.text.split()
            new_title = " ".join(words[:5])
            if len(new_title) > 30:
                new_title = new_title[:30] + "..."
            chat.title = new_title
            await session.commit()

        messages_list = [
            {
                "role": "user" if msg.sender == "user" else "assistant",
                "content": msg.text,
            }
            for msg in db_messages
        ]

    # Generator for streaming response
    async def generate():
        # Send initial thinking placeholder to client
        init_data = json.dumps(
            {"content": "Please wait, AI is thinking..."}, ensure_ascii=False
        )
        yield f"data: {init_data}\n\n"

        partial_reply = ""
        start_time = time.time()
        try:
            response_stream = await client.chat(
                model=selected_model_name, messages=messages_list, stream=True
            )

            async for chunk in response_stream:
                if await request.is_disconnected():
                    # Client disconnected (clicked Stop)
                    break

                text_chunk = None
                if hasattr(chunk, "message") and hasattr(chunk.message, "content"):
                    text_chunk = chunk.message.content
                elif isinstance(chunk, dict) and "message" in chunk and "content" in chunk["message"]:
                    text_chunk = chunk["message"]["content"]

                if text_chunk:
                    partial_reply += text_chunk

                    # Package in JSON to safely stream line breaks
                    data = json.dumps({"content": text_chunk}, ensure_ascii=False)
                    yield f"data: {data}\n\n"

        except asyncio.CancelledError:
            # Triggered on forced cancellation
            pass
        except Exception as e:
            error_data = json.dumps({"error": str(e)}, ensure_ascii=False)
            yield f"data: {error_data}\n\n"
        finally:
            if partial_reply:
                duration = time.time() - start_time
                from metrics import MESSAGES_REPLIED_TOTAL, OLLAMA_RESPONSE_DURATION

                MESSAGES_REPLIED_TOTAL.labels(ai_model=selected_model_name).inc()
                OLLAMA_RESPONSE_DURATION.labels(ai_model=selected_model_name).observe(
                    duration
                )

                bot_msg = Message(
                    chat_id=message.chat_id,
                    sender="assistant",
                    text=partial_reply,
                    created_at=int(time.time()),
                    ai=message.ai,
                )
                async with async_session_local() as db_session:
                    db_session.add(bot_msg)
                    await db_session.commit()

    return StreamingResponse(generate(), media_type="text/plain")


async def get_chat_history(chat_id: int, current_user: dict):
    async with async_session_local() as session:
        user_id = int(current_user["user_id"])

        query = select(Chat).where(Chat.id == chat_id)
        result = await session.execute(query)
        chat = result.scalar_one_or_none()

        if chat is None:
            raise HTTPException(status_code=404, detail="Chat not found")

        if chat.user_id != user_id:
            raise HTTPException(
                status_code=403, detail="Access denied to view history of this chat"
            )

        messages_query = (
            select(Message).where(Message.chat_id == chat_id).order_by(Message.id.asc())
        )
        messages_result = await session.execute(messages_query)
        return messages_result.scalars().all()

