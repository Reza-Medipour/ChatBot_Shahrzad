from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID, uuid4
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/conversations", tags=["Conversations"])


def get_or_create_user(user_id: Optional[str], db: Session) -> models.User:
    if not user_id:
        user_id = str(uuid4())

    user = db.query(models.User).filter(models.User.shahrzaad_id == user_id).first()

    if not user:
        user = models.User(
            shahrzaad_id=user_id,
            is_registered=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user


@router.get("", response_model=List[schemas.ChatSessionResponse])
async def get_conversations(
    x_user_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    user = get_or_create_user(x_user_id, db)

    sessions = db.query(models.ChatSession).filter(
        models.ChatSession.user_id == user.id
    ).order_by(models.ChatSession.updated_at.desc()).all()

    return sessions


@router.post("", response_model=schemas.ChatSessionResponse)
async def create_conversation(
    session_data: schemas.ChatSessionCreate,
    x_user_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    user = get_or_create_user(x_user_id, db)

    new_session = models.ChatSession(
        title=session_data.title,
        user_id=user.id
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return new_session


@router.delete("/{session_id}")
async def delete_conversation(
    session_id: UUID,
    x_user_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    user = get_or_create_user(x_user_id, db)

    session = db.query(models.ChatSession).filter(
        models.ChatSession.id == session_id,
        models.ChatSession.user_id == user.id
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )

    db.delete(session)
    db.commit()

    return {"message": "Session deleted successfully"}


@router.get("/{session_id}/messages", response_model=List[schemas.MessageResponse])
async def get_messages(
    session_id: UUID,
    x_user_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    user = get_or_create_user(x_user_id, db)

    session = db.query(models.ChatSession).filter(
        models.ChatSession.id == session_id,
        models.ChatSession.user_id == user.id
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )

    messages = db.query(models.Message).filter(
        models.Message.session_id == session_id
    ).order_by(models.Message.created_at.asc()).all()

    return messages


@router.post("/{session_id}/messages", response_model=schemas.MessageResponse)
async def create_message(
    session_id: UUID,
    message_data: schemas.MessageCreate,
    x_user_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    user = get_or_create_user(x_user_id, db)

    session = db.query(models.ChatSession).filter(
        models.ChatSession.id == session_id,
        models.ChatSession.user_id == user.id
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )

    new_message = models.Message(
        session_id=session_id,
        content=message_data.content,
        is_user=message_data.is_user
    )
    db.add(new_message)

    session.updated_at = models.func.now()

    db.commit()
    db.refresh(new_message)

    return new_message
