from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/api/conversations", tags=["Conversations"])


@router.get("", response_model=List[schemas.ChatSessionResponse])
async def get_conversations(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    sessions = db.query(models.ChatSession).filter(
        models.ChatSession.user_id == current_user.id
    ).order_by(models.ChatSession.updated_at.desc()).all()

    return sessions


@router.post("", response_model=schemas.ChatSessionResponse)
async def create_conversation(
    session_data: schemas.ChatSessionCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    new_session = models.ChatSession(
        title=session_data.title,
        user_id=current_user.id
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return new_session


@router.delete("/{session_id}")
async def delete_conversation(
    session_id: UUID,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(models.ChatSession).filter(
        models.ChatSession.id == session_id,
        models.ChatSession.user_id == current_user.id
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
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Verify session belongs to user
    session = db.query(models.ChatSession).filter(
        models.ChatSession.id == session_id,
        models.ChatSession.user_id == current_user.id
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
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Verify session belongs to user
    session = db.query(models.ChatSession).filter(
        models.ChatSession.id == session_id,
        models.ChatSession.user_id == current_user.id
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

    # Update session's updated_at
    session.updated_at = models.func.now()

    db.commit()
    db.refresh(new_message)

    return new_message
