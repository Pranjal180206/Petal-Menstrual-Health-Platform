from pydantic import BaseModel, Field
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

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}