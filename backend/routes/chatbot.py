from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Any

from services.auth_service import get_current_user
from services.chatbot_service import get_chatbot_response

router = APIRouter()

class ChatMessageRequest(BaseModel):
    message: str
    conversation_history: List[Dict[str, Any]] = []  # previous messages for context
    language: str = "en"

class ChatMessageResponse(BaseModel):
    reply: str
    timestamp: datetime

@router.post("/chatbot/message", response_model=ChatMessageResponse)
async def send_chatbot_message(
    request: ChatMessageRequest,
    current_user: dict = Depends(get_current_user)
):
    reply = await get_chatbot_response(
        message=request.message,
        history=request.conversation_history,
        language=request.language
    )
    return {"reply": reply, "timestamp": datetime.utcnow()}
