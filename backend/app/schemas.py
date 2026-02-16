from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from uuid import UUID


# User Schemas
class UserBase(BaseModel):
    phone_number: Optional[str] = None
    username: Optional[str] = None
    shahrzaad_id: Optional[str] = None


class UserCreate(BaseModel):
    phone_number: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    shahrzaad_id: Optional[str] = None


class UserLogin(BaseModel):
    username: str
    password: str


class ShahrzaadAutoLogin(BaseModel):
    shahrzaad_id: str


class UserResponse(BaseModel):
    id: UUID
    phone_number: Optional[str]
    username: Optional[str]
    shahrzaad_id: Optional[str]
    is_registered: bool
    created_at: datetime
    last_login: datetime

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
    user_id: Optional[UUID]
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
