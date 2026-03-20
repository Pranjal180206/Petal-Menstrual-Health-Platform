from fastapi import APIRouter, Depends, HTTPException, status, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from models.cycle_model import CycleCreateReq, CycleUpdateReq, TrackerSummary
from services.tracker_service import tracker_service
from services.auth_service import get_current_user

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
