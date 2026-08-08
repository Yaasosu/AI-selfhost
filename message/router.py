from fastapi import APIRouter, Depends, Request

from message.modules import get_available_models, get_chat_history, send_message_stream
from message.scheme import MessageCreate, MessageResponse
from user.modules import get_current_user

router = APIRouter(prefix="/messages", tags=["messages"])


@router.get("/models", response_model=dict)
async def list_models():
    return await get_available_models()


@router.post("/sendmessage/stream")
async def sendmessage_stream(
    message: MessageCreate,
    request: Request,
    current_user: dict = Depends(get_current_user),
):
    return await send_message_stream(message, request, current_user)


@router.get("/{chat_id}/messages", response_model=list[MessageResponse])
async def get_existing_chat_history(
    chat_id: int, current_user: dict = Depends(get_current_user)
):
    return await get_chat_history(chat_id, current_user)
