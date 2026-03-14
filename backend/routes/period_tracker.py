from fastapi import APIRouter, Depends, HTTPException, status
from models.cycle_model import CycleCreateReq, CycleUpdateReq, TrackerSummary
from services.tracker_service import tracker_service
from services.auth_service import get_current_user

router = APIRouter()

@router.get("/", response_model=TrackerSummary)
async def get_tracker(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    summary = await tracker_service.get_tracker_summary(user_id)
    return summary

@router.post("/cycles", status_code=status.HTTP_201_CREATED)
async def log_cycle(request: CycleCreateReq, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    cycle = await tracker_service.log_cycle(user_id, request)
    return cycle

@router.patch("/cycles/{cycle_id}")
async def update_cycle(cycle_id: str, request: CycleUpdateReq, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    updated = await tracker_service.update_cycle(user_id, cycle_id, request)
    if not updated:
        raise HTTPException(status_code=404, detail="Cycle not found or update failed")
    return updated
