from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    chat_id = Column(
        Integer, ForeignKey("chats.id", ondelete="CASCADE"), nullable=False
    )
    sender = Column(String, nullable=False)
    text = Column(String, nullable=False)
    file_url = Column(String, nullable=True)
    created_at = Column(Integer, nullable=False)
    ai = Column(Integer, nullable=True)


    chat = relationship("Chat", back_populates="messages")
