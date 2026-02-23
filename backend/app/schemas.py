from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from uuid import UUID


# User Schemas
class UserBase(BaseModel):
    pass


class UserCreate(BaseModel):
    pass


class UserResponse(BaseModel):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[str] = None


# ChatSession Schemas
class ChatSessionCreate(BaseModel):
    title: Optional[str] = "چت جدید"


class ChatSessionUpdate(BaseModel):
    title: Optional[str] = None


class ChatSessionResponse(BaseModel):
    id: UUID
    title: str
    user_id: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Message Schemas
class MessageCreate(BaseModel):
    content: str
    is_user: bool = True


class MessageResponse(BaseModel):
    id: UUID
    session_id: UUID
    content: str
    is_user: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Chat Request/Response
class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    response: str
