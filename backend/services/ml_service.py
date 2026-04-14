"""
ml_service.py — ML prediction bridge for Petal backend.

Loads menstrual_model.joblib once at import time.
Also loads risk_analysis_adaptive.csv for population-level insights.
Provides predict_next_period(), get_ml_status(), get_population_insights(),
and get_personalized_insights() for use by dashboard_service and friends.

Feature vector (14 features, exact training order):
  1.  baseline             35.14% — rolling mean of cycle_lengths
  2.  LengthofMenses        8.34% — cycle_preferences.period_duration
  3.  MeanMensesLength       8.97% — same as period_duration
  4.  TotalMensesScore       9.69% — MeanBleedingIntensity × period_duration
  5.  MensesScoreDayOne      5.21% — flow_score on Day 1 of cycle
  6.  MensesScoreDayTwo      4.93% — flow_score on Day 2 of cycle
  7.  MensesScoreDayThree    3.10% — flow_score on Day 3 of cycle
  8.  MensesScoreDaySeven    5.57% — flow_score on Day 7 of cycle
  9.  MeanBleedingIntensity  6.58% — mean flow_intensity (spotting=1..heavy=4)
  10. PhasesBleeding         3.96% — IMPUTED: median=2.0 from training data
  11. Age                    4.44% — user.age
  12. UnusualBleeding        1.70% — unusual_bleeding flag from cycle_log
  13. Boys                   1.31% — HARD ZERO (out of scope)
  14. Girls                  1.05% — HARD ZERO (out of scope)

~96% real Petal data. Only PhasesBleeding (3.96%) is imputed.
"""

import os
import logging
from datetime import datetime, timedelta

import numpy as np

logger = logging.getLogger(__name__)

# ── CSV loading (risk_analysis_adaptive.csv) ─────────────────────────────────
# Resolve absolute path anchored to this file — works on Railway regardless of cwd
_BASE_DIR = os.path.dirname(os.path.abspath(__file__))

try:
    import pandas as pd
    _CSV_PATH = os.path.join(_BASE_DIR, "..", "ml_assets", "risk_analysis_adaptive.csv")
    _CSV_PATH = os.path.abspath(_CSV_PATH)
    risk_df = pd.read_csv(_CSV_PATH)
    # Normalise risk_level values — strip trailing spaces
    risk_df["risk_level"] = risk_df["risk_level"].str.strip()
    CSV_AVAILABLE = True
    logger.info(f"[ML] Risk analysis CSV loaded: {len(risk_df)} rows")
except Exception as _csv_err:
    risk_df = None
    CSV_AVAILABLE = False
    logger.warning(f"[ML] Warning: Could not load CSV — {_csv_err}")

# ── Model loading (once at import time) ──────────────────────────────────────
MODEL_PATH = os.path.abspath(
    os.path.join(_BASE_DIR, "..", "ml_assets", "menstrual_model.joblib")
)

try:
    import joblib
    model = joblib.load(MODEL_PATH)
    ML_AVAILABLE = True
    logger.info("[ML] menstrual_model.joblib loaded successfully.")
except Exception as e:
    model = None
    ML_AVAILABLE = False
    logger.warning(f"[ML] Warning: Could not load model — {e}")

# ── Constants ─────────────────────────────────────────────────────────────────
FLOW_MAP = {
    "spotting": 1.0,
    "light":    2.0,
    "average":  3.0,
    "medium":   3.0,   # alias used in Petal UI
    "heavy":    4.0,
}

# Only truly imputed feature — median from training data (PhasesBleeding)
PHASES_BLEEDING_MEDIAN = 2.0


# ── Feature vector assembly ───────────────────────────────────────────────────
def build_feature_vector(cycle_history: list, user: dict) -> np.ndarray:
    """
    Builds the 14-feature input vector from Petal data.
    ~96% real data. Only PhasesBleeding (feature 10) is imputed.
    Features 5-8 use None-aware averaging across cycles when
    daily logs are missing.

    Args:
        cycle_history: output of get_parsed_cycle_history()
        user:          MongoDB user document

    Returns:
        np.ndarray of shape (1, 14) dtype float64
    """
    # ── Feature 9: MeanBleedingIntensity (needed by features 4 & 5-8 fallback)
    flow_values = [
        FLOW_MAP[c["flow_intensity"]]
        for c in cycle_history
        if c.get("flow_intensity") and c["flow_intensity"].lower() in FLOW_MAP
    ]
    mean_bleeding = float(np.mean(flow_values)) if flow_values else 2.5

    # ── Feature 1: baseline — rolling mean of resolved cycle lengths
    cycle_lengths = [
        c["cycle_length"] for c in cycle_history
        if c.get("cycle_length") is not None
    ]
    baseline = float(np.mean(cycle_lengths)) if cycle_lengths else 28.0

    # ── Features 2 & 3: LengthofMenses / MeanMensesLength
    prefs = user.get("cycle_preferences", {})
    period_length = float(prefs.get("period_duration", 5))

    # ── Feature 4: TotalMensesScore
    total_menses_score = mean_bleeding * period_length

    # ── Feature 11: Age
    age = float(user.get("age", 25))

    # ── Features 5–8: per-day flow scores
    # Collect non-None values across cycles; fall back to mean_bleeding
    def mean_day_score(field: str) -> float:
        vals = [
            float(c[field]) for c in cycle_history
            if c.get(field) is not None
        ]
        return float(np.mean(vals)) if vals else mean_bleeding

    menses_day_1 = mean_day_score("menses_score_day_1")
    menses_day_2 = mean_day_score("menses_score_day_2")
    menses_day_3 = mean_day_score("menses_score_day_3")
    menses_day_7 = mean_day_score("menses_score_day_7")

    # ── Feature 10: PhasesBleeding — ONLY imputed feature (3.96%)
    phases_bleeding = PHASES_BLEEDING_MEDIAN

    # ── Feature 12: UnusualBleeding — real data
    unusual_vals = [
        c["unusual_bleeding"] for c in cycle_history
        if c.get("unusual_bleeding") is not None
    ]
    unusual_bleeding = 1.0 if unusual_vals and any(unusual_vals) else 0.0

    # ── Features 13 & 14: Hard zero — birth history out of scope
    boys = 0.0
    girls = 0.0

    # ── Assemble in exact training order ──────────────────────────────────────
    features = np.array([[
        baseline,           #  1  35.14%
        period_length,      #  2   8.34%
        period_length,      #  3   8.97%
        total_menses_score, #  4   9.69%
        menses_day_1,       #  5   5.21%
        menses_day_2,       #  6   4.93%
        menses_day_3,       #  7   3.10%
        menses_day_7,       #  8   5.57%
        mean_bleeding,      #  9   6.58%
        phases_bleeding,    # 10   3.96% ← only imputed feature
        age,                # 11   4.44%
        unusual_bleeding,   # 12   1.70%
        boys,               # 13   1.31%
        girls,              # 14   1.05%
    ]], dtype=np.float64)

    logger.debug(f"[ML] Feature vector: {features}")
    return features


# ── Public API ────────────────────────────────────────────────────────────────
def predict_next_period(cycle_history: list, user: dict) -> dict:
    """
    Predicts the next cycle length using the ML model.

    Args:
        cycle_history: output of get_parsed_cycle_history()
        user:          MongoDB user document

    Returns:
        {
            "predicted_cycle_length": int,
            "next_period_date": str (ISO format) | None,
            "confidence": float | None,
            "ml_driven": bool
        }
    """
    if not ML_AVAILABLE or len(cycle_history) < 3:
        # Arithmetic fallback
        lengths = [c["cycle_length"] for c in cycle_history if c.get("cycle_length")]
        avg = round(sum(lengths) / len(lengths)) if lengths else 28
        last_start = cycle_history[-1]["start_date"] if cycle_history else None
        next_date = (last_start + timedelta(days=avg)).isoformat() if last_start else None
        return {
            "predicted_cycle_length": avg,
            "next_period_date": next_date,
            "confidence": None,
            "ml_driven": False,
        }

    try:
        features = build_feature_vector(cycle_history, user)
        predicted_length = int(round(float(model.predict(features)[0])))
        # Clamp to sane range
        predicted_length = max(20, min(45, predicted_length))

        last_start = cycle_history[-1]["start_date"]
        next_date = (last_start + timedelta(days=predicted_length)).isoformat()

        # RandomForest doesn't output probability for regression;
        # use std of tree predictions as an inverse-confidence proxy
        tree_preds = np.array([t.predict(features)[0] for t in model.estimators_])
        std = float(np.std(tree_preds))
        # Normalise: std=0 → confidence=1.0, std=7 → confidence=0.0
        confidence = round(max(0.0, 1.0 - std / 7.0), 2)

        return {
            "predicted_cycle_length": predicted_length,
            "next_period_date": next_date,
            "confidence": confidence,
            "ml_driven": True,
        }

    except Exception as e:
        logger.error(f"[ML] predict_next_period failed: {e}", exc_info=True)
        # Graceful arithmetic fallback
        lengths = [c["cycle_length"] for c in cycle_history if c.get("cycle_length")]
        avg = round(sum(lengths) / len(lengths)) if lengths else 28
        last_start = cycle_history[-1]["start_date"] if cycle_history else None
        next_date = (last_start + timedelta(days=avg)).isoformat() if last_start else None
        return {
            "predicted_cycle_length": avg,
            "next_period_date": next_date,
            "confidence": None,
            "ml_driven": False,
        }


def get_ml_status() -> dict:
    """Health check — tells you whether the model loaded successfully."""
    return {
        "model_loaded": ML_AVAILABLE,
        "model_type": str(type(model).__name__) if model else None,
        "model_path": os.path.abspath(MODEL_PATH),
        "phases_bleeding_imputed_median": PHASES_BLEEDING_MEDIAN,
        "csv_available": CSV_AVAILABLE,
        "csv_rows": len(risk_df) if CSV_AVAILABLE else 0,
    }


# ── Population insights from CSV ──────────────────────────────────────────────
def get_population_insights() -> dict:
    """
    Derives aggregate insights from the risk analysis CSV.
    Returns population-level statistics to show as context on the
    Insights page — e.g. average cycle length, risk distribution.
    """
    if not CSV_AVAILABLE or risk_df is None:
        return {"available": False}

    try:
        total = len(risk_df)

        # Population average cycle length (personal_mean column)
        pop_avg_cycle = round(float(risk_df["personal_mean"].mean()), 1)
        pop_std_cycle = round(float(risk_df["personal_mean"].std()), 1)

        # Risk level distribution
        risk_counts = risk_df["risk_level"].value_counts().to_dict()
        low_pct   = round(risk_counts.get("LOW",      0) / total * 100, 1)
        mod_pct   = round(risk_counts.get("MODERATE", 0) / total * 100, 1)
        high_pct  = round(risk_counts.get("HIGH",     0) / total * 100, 1)

        # Average deviation (how much an individual cycle deviates
        # from the person's own baseline)
        pop_avg_deviation = round(float(risk_df["deviation"].mean()), 1)

        # Percentage whose personal baseline model is used (vs population)
        pct_using_personal = round(
            float(risk_df["using_personal"].sum()) / total * 100, 1
        )

        # Flag frequency — which concerns appear most
        flags_series = risk_df["flags"].dropna()
        flag_counts: dict[str, int] = {}
        for cell in flags_series:
            for flag in str(cell).split(","):
                f = flag.strip()
                if f:
                    flag_counts[f] = flag_counts.get(f, 0) + 1
        top_flags = sorted(flag_counts.items(), key=lambda x: x[1], reverse=True)[:3]

        return {
            "available": True,
            "population_size": total,
            "avg_cycle_length": pop_avg_cycle,
            "std_cycle_length": pop_std_cycle,
            "avg_deviation": pop_avg_deviation,
            "pct_low_risk": low_pct,
            "pct_moderate_risk": mod_pct,
            "pct_high_risk": high_pct,
            "pct_using_personal_model": pct_using_personal,
            "top_flags": [{"flag": f, "count": c} for f, c in top_flags],
        }

    except Exception as e:
        logger.error(f"[ML] get_population_insights error: {e}", exc_info=True)
        return {"available": False}


# ── Personalised insights from CSV ────────────────────────────────────────────
def get_personalized_insights(cycle_history: list, user: dict) -> dict:  # noqa: N802
    """
    Compares the user's cycle data to the population in the CSV.
    Returns a list of insight cards rendered in the Insights page.

    Each insight card has:
      type     — slug identifying the insight
      severity — "positive" | "info" | "warning"
      title    — short heading
      message  — 1–2 sentence explanation
    """
    if not CSV_AVAILABLE or risk_df is None or not cycle_history:
        return {"available": bool(CSV_AVAILABLE), "insights": [], "population_size": 0}

    try:
        insights: list[dict] = []
        total = len(risk_df)

        pop_avg  = float(risk_df["personal_mean"].mean())
        pop_std  = float(risk_df["personal_mean"].std())
        pop_avg_dev = float(risk_df["deviation"].mean())

        # ── User's average cycle length
        cycle_lengths = [
            c["cycle_length"] for c in cycle_history if c.get("cycle_length")
        ]

        if cycle_lengths:
            user_avg = sum(cycle_lengths) / len(cycle_lengths)

            # --- Insight 1: Cycle length vs population ---
            if user_avg < pop_avg - pop_std:
                insights.append({
                    "type": "cycle_length_short",
                    "severity": "info",
                    "title": "Shorter cycles than average",
                    "message": (
                        f"Your average cycle is {user_avg:.0f} days — shorter than the "
                        f"population average of {pop_avg:.0f} days. "
                        "Short cycles (< 24 days) can occasionally signal hormonal changes, "
                        "but many people naturally have shorter cycles."
                    ),
                })
            elif user_avg > pop_avg + pop_std:
                insights.append({
                    "type": "cycle_length_long",
                    "severity": "info",
                    "title": "Longer cycles than average",
                    "message": (
                        f"Your average cycle is {user_avg:.0f} days — longer than the "
                        f"population average of {pop_avg:.0f} days. "
                        "Occasional long cycles are normal; consistent patterns > 35 days "
                        "are worth mentioning to a healthcare professional."
                    ),
                })
            else:
                insights.append({
                    "type": "cycle_length_normal",
                    "severity": "positive",
                    "title": "Cycle length within normal range",
                    "message": (
                        f"Your average cycle ({user_avg:.0f} days) is well within the "
                        f"population range of {pop_avg - pop_std:.0f}–{pop_avg + pop_std:.0f} days. "
                        "Keep up the great tracking!"
                    ),
                })

            # --- Insight 2: Cycle regularity (std deviation of user's cycles) ---
            if len(cycle_lengths) >= 3:
                import statistics
                user_std = statistics.stdev(cycle_lengths)
                if user_std <= pop_avg_dev:
                    insights.append({
                        "type": "regularity_high",
                        "severity": "positive",
                        "title": "Very regular cycles",
                        "message": (
                            f"Your cycles vary by only ±{user_std:.1f} days — "
                            "more consistent than most people in our dataset. "
                            "Regular cycles make it easier to plan ahead!"
                        ),
                    })
                elif user_std <= pop_avg_dev * 2.5:
                    insights.append({
                        "type": "regularity_moderate",
                        "severity": "info",
                        "title": "Moderate cycle variation",
                        "message": (
                            f"Your cycles vary by about ±{user_std:.1f} days, "
                            "which is typical for most people. "
                            "Continued tracking will sharpen the AI's predictions over time."
                        ),
                    })
                else:
                    insights.append({
                        "type": "regularity_low",
                        "severity": "warning",
                        "title": "Irregular cycle pattern detected",
                        "message": (
                            f"Your cycles vary by ±{user_std:.1f} days, which is more "
                            "than usual. Stress, sleep, diet, or health changes can all "
                            "affect regularity. Consider discussing with a healthcare provider "
                            "if this persists."
                        ),
                    })

        # --- Insight 3: Data quality / how many cycles logged ---
        n_logged = len(cycle_history)
        if n_logged < 3:
            insights.append({
                "type": "log_more",
                "severity": "info",
                "title": "Log more cycles for richer insights",
                "message": (
                    f"You've logged {n_logged} cycle{'s' if n_logged != 1 else ''}. "
                    "Our AI-powered insights improve significantly after 3+ cycles — "
                    "keep tracking!"
                ),
            })
        elif n_logged >= 6:
            insights.append({
                "type": "good_history",
                "severity": "positive",
                "title": "Great tracking history!",
                "message": (
                    f"You've logged {n_logged} cycles — that's excellent! "
                    f"In our dataset, {round(float(risk_df['n_cycles_known'].mean())):.0f} cycles "
                    "on average before patterns stabilise. You're ahead of the curve."
                ),
            })

        return {
            "available": True,
            "insights": insights,
            "population_size": total,
        }

    except Exception as e:
        logger.error(f"[ML] get_personalized_insights error: {e}", exc_info=True)
        return {"available": False, "insights": [], "population_size": 0}

def assess_risk_from_cycles(cycle_history: list, user: dict) -> dict:
    """
    Evaluates ML-driven risk factors from the user's cycle history.
    """
    if not ML_AVAILABLE or len(cycle_history) < 3:
        return {
            "overall_risk": "unknown",
            "cycle_consistency": None,
            "ml_factors": []
        }

    res = predict_next_period(cycle_history, user)
    factors = []
    
    predicted_len = res["predicted_cycle_length"]
    conf = res["confidence"]
    
    # Calculate consistency score
    consistency = int(conf * 100) if conf is not None else 50
    overall_risk = "low"
    
    # Factor 1: AI Predictability
    if conf is not None and conf < 0.4:
        factors.append({
            "icon_type": "AlertTriangle",
            "bg_color": "#FFF0F4",
            "title": "Low Predictability (AI)",
            "badge_text": "Monitor",
            "badge_bg": "#FFF0F4",
            "badge_color": "#FF0055",
            "description": "The ML model has low confidence in predicting your next cycle, indicating potential irregularity."
        })
        overall_risk = "moderate"
    elif conf is not None and conf > 0.8:
        factors.append({
            "icon_type": "CheckCircle",
            "bg_color": "#F0FDF4",
            "title": "Highly Predictable Pattern",
            "badge_text": "Good",
            "badge_bg": "#F0FDF4",
            "badge_color": "#16A34A",
            "description": "Your cycle lengths and symptoms form a highly consistent pattern that AI can predict with great accuracy."
        })
        
    # Factor 2: Baseline deviation
    lengths = [c["cycle_length"] for c in cycle_history if c.get("cycle_length")]
    if lengths:
        baseline = float(np.mean(lengths))
        drift = abs(predicted_len - baseline)
        
        if drift >= 5:
            factors.append({
                "icon_type": "Activity",
                "bg_color": "#FFF7E6",
                "title": "Predicted Cycle Drift",
                "badge_text": "Moderate",
                "badge_bg": "#FFF7E6",
                "badge_color": "#EA580C",
                "description": f"AI predicts your next cycle will be {predicted_len} days, which is a significant deviation from your recent {int(baseline)}-day average."
            })
            if overall_risk == "low":
                overall_risk = "moderate"
                
    return {
        "overall_risk": overall_risk,
        "cycle_consistency": consistency,
        "ml_factors": factors
    }
