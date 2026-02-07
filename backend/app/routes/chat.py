from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
import httpx
from .. import models, schemas, auth
from ..database import get_db
from ..config import get_settings

router = APIRouter(prefix="/api", tags=["Chat"])
settings = get_settings()


async def generate_bot_response(user_message: str, session_id: str) -> str:
    """
    Generate bot response using external LLM API or default responses.
    You can integrate with OpenAI, Anthropic, or any other LLM service here.
    """
    # For now, return a simple echo response
    # In production, call your LLM API here

    if settings.LLM_API_URL:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    settings.LLM_API_URL,
                    json={
                        "message": user_message,
                        "session_id": session_id
                    },
                    headers={
                        "Authorization": f"Bearer {settings.LLM_API_KEY}" if settings.LLM_API_KEY else ""
                    }
                )
                if response.status_code == 200:
                    data = response.json()
                    return data.get("response", "متاسفانه در حال حاضر قادر به پاسخگویی نیستم.")
        except Exception as e:
            print(f"Error calling LLM API: {e}")

    # Default response if no LLM API configured
    responses = [
        "سلام! من چت بات شهرزاد هستم. چطور می‌تونم کمکتون کنم؟",
        "این یک پاسخ نمونه است. برای اتصال به سرویس هوش مصنوعی، لطفا تنظیمات LLM_API_URL را در فایل .env تنظیم کنید.",
        "درخواست شما دریافت شد. چه موضوع دیگری می‌تونم کمکتون کنم؟"
    ]

    import random
    return random.choice(responses)


@router.post("/chat", response_model=schemas.ChatResponse)
async def chat(
    request: schemas.ChatRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Verify session belongs to user
    session = db.query(models.ChatSession).filter(
        models.ChatSession.id == UUID(request.session_id),
        models.ChatSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )

    # Save user message
    user_message = models.Message(
        session_id=UUID(request.session_id),
        content=request.message,
        is_user=True
    )
    db.add(user_message)
    db.commit()

    # Generate bot response
    bot_response_text = await generate_bot_response(request.message, request.session_id)

    # Save bot message
    bot_message = models.Message(
        session_id=UUID(request.session_id),
        content=bot_response_text,
        is_user=False
    )
    db.add(bot_message)

    # Update session title if it's the first message
    messages_count = db.query(models.Message).filter(
        models.Message.session_id == UUID(request.session_id)
    ).count()

    if messages_count <= 2:  # User message + bot message
        title = request.message[:50] + ("..." if len(request.message) > 50 else "")
        session.title = title

    # Update session's updated_at
    session.updated_at = models.func.now()

    db.commit()

    return {"response": bot_response_text}
