from typing import List
from models.report_model import RiskAnalysisResult, RiskFactor
from services.tracker_service import TrackerService
import io

class ReportsService:
    @staticmethod
    async def analyze_risks(user_id: str) -> RiskAnalysisResult:
        cycles = await TrackerService.get_user_cycles(user_id)
        
        factors = []
        cycle_consistency = 100
        avg_length = 28
        intensity_trend = "Stable"
        
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
                if 20 <= gap <= 45:
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
            factors=factors
        )

    @staticmethod
    async def generate_risk_pdf(user_id: str) -> io.BytesIO:
        # A simple text generation acting as our "PDF" / Report document for MVP
        report_data = await ReportsService.analyze_risks(user_id)
        
        content = "PETAL HEALTH RISK REPORT\n"
        content += "=" * 30 + "\n\n"
        content += f"Average Cycle Length: {report_data.average_cycle_length} Days\n"
        content += f"Cycle Consistency: {report_data.cycle_consistency}%\n"
        content += f"Symptom Intensity Trend: {report_data.symptom_intensity}\n\n"
        
        content += "DETECTED RISK FACTORS\n"
        content += "-" * 30 + "\n"
        if not report_data.factors:
            content += "No elevated risks detected.\n"
        else:
            for factor in report_data.factors:
                content += f"[{factor.badge_text}] {factor.title}\n"
                content += f"   {factor.description}\n\n"
                
        content += "\nGenerated securely by Petal Health."
        
        file_stream = io.BytesIO(content.encode("utf-8"))
        return file_stream

reports_service = ReportsService()
