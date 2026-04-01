from fastapi import APIRouter, Depends
from models.report_model import RiskAnalysisResult
from services.reports_service import reports_service
from services.auth_service import get_current_user
router = APIRouter()

@router.get("/risk-analysis", response_model=RiskAnalysisResult)
async def get_risk_analysis(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    result = await reports_service.analyze_risks(user_id, current_user)
    return result

