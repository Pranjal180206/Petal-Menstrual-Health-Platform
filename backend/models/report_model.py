from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from bson import ObjectId
from database import PyObjectId


class ReportPeriod(BaseModel):
    start: datetime
    end: datetime


class RiskSummary(BaseModel):
    latest_risk_score: float
    risk_level: str


class HealthReport(BaseModel):

    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    user_id: PyObjectId

    report_period: ReportPeriod

    avg_cycle_length: int

    irregular_cycles: int

    risk_summary: RiskSummary

    report_file_url: str

    generated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
    )

from typing import List

class RiskFactor(BaseModel):
    icon_type: str
    bg_color: str
    title: str
    badge_text: str
    badge_bg: str
    badge_color: str
    description: str

class RiskAnalysisResult(BaseModel):
    data_insufficient: bool = False
    cycles_logged: int = 0
    overall_risk: str = "unknown"
    cycle_consistency: int = 0
    symptom_intensity: str = "unknown"
    average_cycle_length: int = 0
    factors: List[RiskFactor] = []
    symptom_trend: list = []
    cycle_comparison: list = []