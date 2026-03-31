from fastapi import APIRouter, Depends
from database import get_db
import services.dashboard_service as dashboard_service
from services.auth_service import get_current_user

router = APIRouter()

@router.get("/dashboard/summary")
async def get_dashboard_summary(db=Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    return await dashboard_service.get_dashboard_summary(user_id, db, user=current_user)

@router.get("/dashboard/ml-status")
async def ml_status():
    from services.ml_service import get_ml_status
    return get_ml_status()

@router.get("/insights/")
async def get_insights(db=Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    return await dashboard_service.get_insights(user_id, db)
