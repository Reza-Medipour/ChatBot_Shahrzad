# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from uuid import UUID
# import httpx
# from .. import models, schemas, auth
# from ..database import get_db
# from ..config import get_settings

# router = APIRouter(prefix="", tags=["Chat"])
# settings = get_settings()


# async def generate_bot_response(user_message: str, session_id: str) -> str:
#     """
#     Generate bot response using external LLM API or default responses.
#     You can integrate with OpenAI, Anthropic, or any other LLM service here.
#     """
#     # For now, return a simple echo response
#     # In production, call your LLM API here

#     if settings.LLM_API_URL:
#         try:
#             async with httpx.AsyncClient(timeout=30.0) as client:
#                 # Prepare headers
#                 headers = {
#                     "accept": "application/json",
#                     "Content-Type": "application/json"
#                 }

#                 # Add Authorization header only if API key is provided
#                 if settings.LLM_API_KEY:
#                     headers["Authorization"] = f"Bearer {settings.LLM_API_KEY}"

#                 # Call external LLM API
#                 response = await client.post(
#                     settings.LLM_API_URL,
#                     json={
#                         "session_id": session_id,
#                         "message": user_message
#                     },
#                     headers=headers
#                 )

#                 if response.status_code == 200:
#                     data = response.json()
#                     return data.get("response", "متاسفانه در حال حاضر قادر به پاسخگویی نیستم.")
#         except Exception as e:
#             print(f"Error calling LLM API: {e}")

#     # Default response if no LLM API configured
#     responses = [
#         "سلام! من چت بات شهرزاد هستم. چطور می‌تونم کمکتون کنم؟",
#         "این یک پاسخ نمونه است. برای اتصال به سرویس هوش مصنوعی، لطفا تنظیمات LLM_API_URL را در فایل .env تنظیم کنید.",
#         "درخواست شما دریافت شد. چه موضوع دیگری می‌تونم کمکتون کنم؟"
#     ]

#     import random
#     return random.choice(responses)


# @router.post("/chat", response_model=schemas.ChatResponse)
# async def chat(
#     request: schemas.ChatRequest,
#     db: Session = Depends(get_db)
# ):
#     session = db.query(models.ChatSession).filter(
#         models.ChatSession.id == UUID(request.session_id)
#     ).first()

#     if not session:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Session not found"
#         )

#     # Save user message
#     user_message = models.Message(
#         session_id=UUID(request.session_id),
#         content=request.message,
#         is_user=True
#     )
#     db.add(user_message)
#     db.commit()

#     # Generate bot response
#     bot_response_text = await generate_bot_response(request.message, request.session_id)

#     # Save bot message
#     bot_message = models.Message(
#         session_id=UUID(request.session_id),
#         content=bot_response_text,
#         is_user=False
#     )
#     db.add(bot_message)

#     # Update session title if it's the first message
#     messages_count = db.query(models.Message).filter(
#         models.Message.session_id == UUID(request.session_id)
#     ).count()

#     if messages_count <= 2:  # User message + bot message
#         title = request.message[:50] + ("..." if len(request.message) > 50 else "")
#         session.title = title

#     # Update session's updated_at
#     session.updated_at = models.func.now()

#     db.commit()

#     return {"response": bot_response_text}






from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
import httpx

from .. import models, schemas
from ..database import get_db
from ..config import get_settings

router = APIRouter(prefix="", tags=["Chat"])
settings = get_settings()


async def generate_bot_response(user_message: str, session_id: str) -> str:
    """
    Call external LLM API.

    LLM Contract:
    - Request: JSON
    - Response: plain string (text/plain)
    """

    if not settings.LLM_API_URL:
        return "❌ آدرس LLM تنظیم نشده است."

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            headers = {
                "Content-Type": "application/json",
                "Accept": "text/plain"
            }

            # Optional API Key
            if settings.LLM_API_KEY:
                headers["Authorization"] = f"Bearer {settings.LLM_API_KEY}"

            response = await client.post(
                settings.LLM_API_URL,
                json={
                    "message": user_message,
                    "session_id": session_id
                },
                headers=headers
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=502,
                    detail=f"LLM error {response.status_code}: {response.text}"
                )

            # 🔥 IMPORTANT: LLM returns STRING, not JSON
            bot_reply = response.text.strip()

            if not bot_reply:
                return "پاسخی از مدل دریافت نشد."

            return bot_reply

    except httpx.TimeoutException:
        return "⏳ زمان پاسخ‌دهی مدل بیش از حد مجاز طول کشید."
    except Exception as e:
        print(f"[LLM ERROR] {e}")
        return "❌ خطا در ارتباط با سرویس هوش مصنوعی."


@router.post("/chat", response_model=schemas.ChatResponse)
async def chat(
    request: schemas.ChatRequest,
    db: Session = Depends(get_db)
):
    # Validate session
    session = db.query(models.ChatSession).filter(
        models.ChatSession.id == UUID(request.session_id)
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

    # Call LLM
    bot_response_text = await generate_bot_response(
        user_message=request.message,
        session_id=request.session_id
    )

    # Save bot message
    bot_message = models.Message(
        session_id=UUID(request.session_id),
        content=bot_response_text,
        is_user=False
    )
    db.add(bot_message)

    # Update session title (only first exchange)
    messages_count = db.query(models.Message).filter(
        models.Message.session_id == UUID(request.session_id)
    ).count()

    if messages_count <= 2:
        session.title = request.message[:50] + (
            "..." if len(request.message) > 50 else ""
        )

    session.updated_at = models.func.now()
    db.commit()

    return {"response": bot_response_text}
