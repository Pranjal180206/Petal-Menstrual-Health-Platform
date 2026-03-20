from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Dict, Any

from services.auth_service import get_current_user
from services.chatbot_service import get_chatbot_response

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

class ChatMessageRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    conversation_history: List[Dict[str, Any]] = []  # previous messages for context
    language: str = "en"

class ChatMessageResponse(BaseModel):
    reply: str
    timestamp: datetime

@router.post("/chatbot/message", response_model=ChatMessageResponse)
@limiter.limit("10/minute")
async def send_chatbot_message(
    request: Request,
    body: ChatMessageRequest,
    current_user: dict = Depends(get_current_user)
):
    reply = await get_chatbot_response(
        message=body.message,
        history=body.conversation_history,
        language=body.language
    )
    return {"reply": reply, "timestamp": datetime.utcnow()}
