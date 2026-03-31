from fastapi import APIRouter, Depends, Request
from fastapi.responses import Response
from models.report_model import RiskAnalysisResult
from services.reports_service import reports_service
from services.auth_service import get_current_user

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

@router.get("/risk-analysis", response_model=RiskAnalysisResult)
async def get_risk_analysis(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    result = await reports_service.analyze_risks(user_id, current_user)
    return result

@router.get("/export")
@limiter.limit("10/minute")
async def export_risk_report(request: Request, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    user_name = current_user.get("name", "User")
    
    result = await reports_service.analyze_risks(user_id, current_user)
    pdf_bytes = await reports_service.generate_pdf_report(result, user_name)
    
    return Response(
        content=pdf_bytes, 
        media_type="application/pdf", 
        headers={"Content-Disposition": 'attachment; filename="petal_risk_report.pdf"'}
    )
