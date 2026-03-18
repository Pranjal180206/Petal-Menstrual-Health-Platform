from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from models.report_model import RiskAnalysisResult
from services.reports_service import reports_service
from services.auth_service import get_current_user

router = APIRouter()

@router.get("/risk-analysis", response_model=RiskAnalysisResult)
async def get_risk_analysis(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    result = await reports_service.analyze_risks(user_id)
    return result

@router.get("/export")
async def export_risk_report(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    file_stream = await reports_service.generate_risk_pdf(user_id)
    
    # Send text as downloadable file for MVP (can swap with reportlab logic later for real PDF)
    return StreamingResponse(
        file_stream, 
        media_type="text/plain", 
        headers={"Content-Disposition": "attachment; filename=petal_risk_report.txt"}
    )
