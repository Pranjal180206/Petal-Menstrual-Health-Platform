from fastapi import APIRouter, Depends, HTTPException, status, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from models.cycle_model import CycleCreateReq, CycleUpdateReq, TrackerSummary
from services.tracker_service import tracker_service
from services.auth_service import get_current_user
from database import get_db
from pydantic import BaseModel, field_validator
from typing import Optional

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

@router.get("/", response_model=TrackerSummary)
@limiter.limit("60/minute")
async def get_tracker(request: Request, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    summary = await tracker_service.get_tracker_summary(user_id)
    return summary

@router.post("/cycles", status_code=status.HTTP_201_CREATED)
@limiter.limit("30/minute")
async def log_cycle(request: Request, body: CycleCreateReq, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    cycle = await tracker_service.log_cycle(user_id, body)
    return cycle

@router.patch("/cycles/{cycle_id}")
@limiter.limit("30/minute")
async def update_cycle(request: Request, cycle_id: str, body: CycleUpdateReq, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    updated = await tracker_service.update_cycle(user_id, cycle_id, body)
    if not updated:
        raise HTTPException(status_code=404, detail="Cycle not found or update failed")
    return updated

class MoodLogRequest(BaseModel):
    mood: str
    flow_score: Optional[float] = None
    # Per-day bleeding intensity: 1.0=spotting, 2.0=light, 3.0=average, 4.0=heavy
    # Collected on period days only, null on non-period days

    @field_validator("flow_score")
    @classmethod
    def validate_flow_score(cls, v):
        if v is not None and v not in (1.0, 2.0, 3.0, 4.0):
            raise ValueError("flow_score must be one of: 1.0, 2.0, 3.0, 4.0")
        return v

@router.post("/mood-today")
@limiter.limit("10/minute")
async def log_mood_today(
    request: Request,
    body: MoodLogRequest,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = await tracker_service.log_mood_today(
        str(current_user["_id"]), body.mood, db, flow_score=body.flow_score
    )
    return result
