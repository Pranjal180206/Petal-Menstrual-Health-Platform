from typing import List
from models.report_model import RiskAnalysisResult, RiskFactor
from services.tracker_service import TrackerService
from services.cycle_history import (
    CYCLE_MIN_DAYS,
    CYCLE_MAX_DAYS,
    get_parsed_cycle_history
)
from services.ml_service import assess_risk_from_cycles, ML_AVAILABLE
from fpdf import FPDF
from datetime import datetime

class ReportsService:
    @staticmethod
    async def analyze_risks(user_id: str, current_user: dict = None) -> RiskAnalysisResult:
        from database import get_db
        import datetime
        cycles = await TrackerService.get_user_cycles(user_id)
        
        if len(cycles) < 3:
            return RiskAnalysisResult(
                data_insufficient=True,
                cycles_logged=len(cycles),
                factors=[],
                overall_risk="unknown",
                symptom_trend=[],
                cycle_comparison=[]
            )
            
        cycle_comparison = []
        recent_cycles = sorted(cycles, key=lambda x: x["cycle_start_date"], reverse=True)[:3]
        for i, c in enumerate(recent_cycles):
            c_len = 28
            if i + 1 < len(cycles):
                c_len = (c["cycle_start_date"] - cycles[i+1]["cycle_start_date"]).days
            intensity = c.get("flow_intensity", "average")
            label = f"Cycle 0{i+1}"
            if i == 0:
                label += " (Recent)"
            elif i == 2:
                label += " (Average)"
            cycle_comparison.append({
                "label": label,
                "length": c_len,
                "intensity": intensity
            })

        db = get_db()
        thirty_days_ago = datetime.datetime.utcnow() - datetime.timedelta(days=30)
        # Fetch from the unified cycle_logs collection which holds daily logs too
        symptoms_cursor = db["cycle_logs"].find({
            "user_id": user_id, 
            "cycle_start_date": {"$gte": thirty_days_ago}
        })
        daily_logs = await symptoms_cursor.to_list(length=100)
        
        # Initialize severity mapping based on 1-3 scale
        SYMPTOM_SEVERITY = {
            "cramps": 3.0,
            "fatigue": 2.0,
        }
        
        symptom_trend_dict = {
            "WK 01": {"week": "WK 01", "cramps": 0.0, "fatigue": 0.0, "c_count": 0, "f_count": 0},
            "WK 02": {"week": "WK 02", "cramps": 0.0, "fatigue": 0.0, "c_count": 0, "f_count": 0},
            "WK 03": {"week": "WK 03", "cramps": 0.0, "fatigue": 0.0, "c_count": 0, "f_count": 0},
            "WK 04": {"week": "WK 04", "cramps": 0.0, "fatigue": 0.0, "c_count": 0, "f_count": 0},
        }
        
        for log in daily_logs:
            # Determine which week it belongs to (WK04 is most recent 7 days, WK01 is oldest)
            log_date = log.get("cycle_start_date") or log.get("created_at")
            if not log_date:
                continue
                
            week_offset = (datetime.datetime.utcnow() - log_date).days // 7
            week_num = min(4, max(1, week_offset + 1))
            week_key = f"WK 0{5 - week_num}"
            
            if week_key in symptom_trend_dict:
                symptoms = [s.lower() for s in log.get("symptoms", [])]
                if "cramps" in symptoms:
                    symptom_trend_dict[week_key]["cramps"] += SYMPTOM_SEVERITY["cramps"]
                    symptom_trend_dict[week_key]["c_count"] += 1
                if "fatigue" in symptoms:
                    symptom_trend_dict[week_key]["fatigue"] += SYMPTOM_SEVERITY["fatigue"]
                    symptom_trend_dict[week_key]["f_count"] += 1

        # Calculate averages, then remove count keys
        for k, v in symptom_trend_dict.items():
            if v["c_count"] > 0:
                v["cramps"] = round(v["cramps"] / v["c_count"], 1)
            else:
                v["cramps"] = 0.0
                
            if v["f_count"] > 0:
                v["fatigue"] = round(v["fatigue"] / v["f_count"], 1)
            else:
                v["fatigue"] = 0.0
                
            v.pop("c_count")
            v.pop("f_count")

        symptom_trend = list(symptom_trend_dict.values())

        symptom_trend = list(symptom_trend_dict.values())
        
        factors = []
        cycle_consistency = 100
        avg_length = 28
        intensity_trend = "Stable"
        overall_risk = "low"
        
        if len(cycles) >= 2:
            # Sort chronologically (oldest first for trend analysis)
            sorted_cycles = sorted(cycles, key=lambda x: x["cycle_start_date"])
            
            # Calculate Average Length & Consistency
            total_days = 0
            valid_gaps = 0
            lengths = []
            
            for i in range(len(sorted_cycles) - 1):
                start_current = sorted_cycles[i]["cycle_start_date"]
                start_next = sorted_cycles[i+1]["cycle_start_date"]
                gap = (start_next - start_current).days
                if CYCLE_MIN_DAYS <= gap <= CYCLE_MAX_DAYS:
                    total_days += gap
                    valid_gaps += 1
                    lengths.append(gap)
            
            if valid_gaps > 0:
                avg_length = total_days // valid_gaps
                
                # Check variance for Irregular Cycle risk
                if len(lengths) >= 2:
                    variance = max(lengths) - min(lengths)
                    if variance > 4:
                        cycle_consistency = max(50, 100 - (variance * 5))
                        factors.append(RiskFactor(
                            icon_type="CalendarX",
                            bg_color="#FFF0F4",
                            title="Irregular Cycle Length",
                            badge_text="High Priority",
                            badge_bg="#FFF0F4",
                            badge_color="#FF0055",
                            description=f"Variance of {variance} days across recent cycles. This may indicate hormonal imbalance."
                        ))
            
            # Check Flow Intensity trend
            heavy_count_old = sum(1 for c in sorted_cycles[:len(sorted_cycles)//2] if c.get("flow_intensity", "").lower() == "heavy")
            heavy_count_new = sum(1 for c in sorted_cycles[len(sorted_cycles)//2:] if c.get("flow_intensity", "").lower() == "heavy")
            
            if heavy_count_new > heavy_count_old:
                intensity_trend = "Increasing"
                factors.append(RiskFactor(
                    icon_type="Droplet",
                    bg_color="#FFF7E6",
                    title="Flow Intensity Increase",
                    badge_text="Moderate",
                    badge_bg="#FFF7E6",
                    badge_color="#EA580C",
                    description="Self-reported 'Heavy' flow has increased in recent cycles."
                ))
            elif heavy_count_new < heavy_count_old:
                intensity_trend = "Decreasing"
                
            # Check persistent symptoms
            recent_symptoms = [s for c in sorted_cycles[-3:] for s in c.get("symptoms", [])]
            if recent_symptoms.count("Cramps") >= 2 or recent_symptoms.count("Acne") >= 2:
                factors.append(RiskFactor(
                    icon_type="Frown",
                    bg_color="#FFF0F4",
                    title="Persistent Symptoms",
                    badge_text="Monitor",
                    badge_bg="#FFF0F4",
                    badge_color="#FF0055",
                    description="Severe physical symptoms logged consistently in recent cycles."
                ))
                
        # ML Model Risk Assessment
        if ML_AVAILABLE and current_user is not None:
            parsed_history = await get_parsed_cycle_history(db, user_id)
            if len(parsed_history) >= 3:
                ml_risk = assess_risk_from_cycles(parsed_history, current_user)
                if ml_risk["cycle_consistency"] is not None:
                    cycle_consistency = ml_risk["cycle_consistency"]
                if ml_risk["overall_risk"] != "unknown":
                    overall_risk = ml_risk["overall_risk"]
                for mf in ml_risk["ml_factors"]:
                    factors.append(RiskFactor(**mf))
                
        # Fallback if no data
        if not factors and len(cycles) > 0:
             factors.append(RiskFactor(
                icon_type="Info",
                bg_color="#F3E8FF",
                title="Stable Tracking",
                badge_text="Low",
                badge_bg="#F3E8FF",
                badge_color="#7C3AED",
                description="Your recent cycles appear regular without major deviations."
            ))

        return RiskAnalysisResult(
            cycle_consistency=cycle_consistency,
            symptom_intensity=intensity_trend,
            average_cycle_length=avg_length,
            factors=factors,
            symptom_trend=symptom_trend,
            cycle_comparison=cycle_comparison,
            overall_risk=overall_risk
        )

    @staticmethod
    async def generate_pdf_report(analysis_result: RiskAnalysisResult, user_name: str) -> bytes:
        pdf = FPDF()
        pdf.add_page()
        
        # Header
        pdf.set_font("helvetica", "B", 16)
        pdf.cell(0, 10, "PETAL HEALTH PLATFORM - RISK ANALYSIS REPORT", ln=True, align="C")
        
        # User details
        pdf.set_font("helvetica", "", 12)
        pdf.cell(0, 10, f"User: {user_name}", ln=True)
        pdf.cell(0, 10, f"Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC", ln=True)
        pdf.ln(5)
        
        if analysis_result.data_insufficient:
            pdf.set_font("helvetica", "B", 14)
            pdf.cell(0, 10, "Data Insufficient", ln=True)
            pdf.set_font("helvetica", "", 12)
            pdf.cell(0, 10, f"You have logged {analysis_result.cycles_logged} cycles.", ln=True)
            pdf.cell(0, 10, "Please log at least 3 cycles before a full risk report can be generated.", ln=True)
            return pdf.output()
            
        RISK_DISPLAY = {
            "low": "Low Risk",
            "moderate": "Moderate Risk",
            "high": "High Risk",
            "unknown": "Unable to Assess"
        }
        risk_display = RISK_DISPLAY.get(analysis_result.overall_risk, "Unable to Assess")

        # Overall Risk Summary
        pdf.set_font("helvetica", "B", 14)
        pdf.cell(0, 10, "Summary", ln=True)
        pdf.set_font("helvetica", "", 12)
        pdf.cell(0, 8, f"Overall Risk Level: {risk_display}", ln=True)
        pdf.cell(0, 8, f"Cycle Consistency: {analysis_result.cycle_consistency}%", ln=True)
        pdf.cell(0, 8, f"Average Cycle Length: {analysis_result.average_cycle_length} Days", ln=True)
        pdf.cell(0, 8, f"Symptom Intensity Trend: {analysis_result.symptom_intensity}", ln=True)
        pdf.ln(5)
        
        # Risk Factors
        pdf.set_font("helvetica", "B", 14)
        pdf.cell(0, 10, "Detected Risk Factors", ln=True)
        
        if not analysis_result.factors:
            pdf.set_font("helvetica", "I", 12)
            pdf.cell(0, 10, "No elevated risks detected.", ln=True)
        else:
            for factor in analysis_result.factors:
                pdf.set_font("helvetica", "B", 12)
                pdf.cell(0, 8, f"[{factor.badge_text}] {factor.title}", ln=True)
                pdf.set_font("helvetica", "", 11)
                pdf.multi_cell(0, 6, factor.description)
                pdf.ln(3)
                
        return pdf.output()

reports_service = ReportsService()
