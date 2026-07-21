from pydantic import BaseModel


class MessageCreate(BaseModel):
    chat_id: int
    text: str
    ai: int


class MessageResponse(BaseModel):
    id: int
    chat_id: int
    sender: str
    text: str
    created_at: int
    ai: int | None = None

    class Config:
        from_attributes = True
