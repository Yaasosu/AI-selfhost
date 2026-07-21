from pydantic import BaseModel


class ChatCreate(BaseModel):
    title: str | None = "Новый чат"


class ChatUpdate(BaseModel):
    title: str


class ChatResponse(BaseModel):
    id: int
    title: str | None = "Новый чат"
    user_id: int

    class Config:
        from_attributes = True
