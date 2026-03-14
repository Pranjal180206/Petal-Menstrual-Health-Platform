import os
from fastapi import APIRouter, Request, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional
from config import limiter
from services.chatbot_service import chatbot_service
from services.auth_service import get_current_user

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., max_length=1000)
    conversationHistory: List[ChatMessage] = []
    language: Optional[str] = "en"

class ChatResponse(BaseModel):
    response: str
    updatedHistory: List[ChatMessage]

# Example rate limit for chatbot explicitly
@router.post("/message")
@limiter.limit("10/minute")
async def send_message(request: Request, body: ChatRequest, current_user: dict = Depends(get_current_user)):
    try:
        reply = await chatbot_service.get_response(
            message=body.message,
            history=[msg.model_dump() for msg in body.conversationHistory],
            language=body.language
        )
        
        updated_history = body.conversationHistory[-10:].copy()
        updated_history.append(ChatMessage(role="user", content=body.message))
        updated_history.append(ChatMessage(role="assistant", content=reply))
        
        return ChatResponse(
            response=reply,
            updatedHistory=updated_history
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error communicating with chatbot service.")
