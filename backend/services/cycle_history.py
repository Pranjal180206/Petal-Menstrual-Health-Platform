# ML_HOOKUP: get_parsed_cycle_history() is the single
# entry point for ML models to receive standardized
# cycle data. To integrate:
#   1. Import this function in your ml_service.py
#   2. Pass the returned list directly to model.predict()
#   3. Replace the fallback logic in tracker_service.py
#      and dashboard_service.py with model output

from datetime import datetime, timedelta
from typing import Optional

# Unified cycle gap bounds — matched across all services
CYCLE_MIN_DAYS = 20
CYCLE_MAX_DAYS = 45


async def get_day_flow_score(
    db,
    user_id: str,
    cycle_start: datetime,
    day: int
) -> Optional[float]:
    """
    Looks up the flow_score from cycle_logs for
    cycle_start + (day-1) days.
    Returns float or None if not logged.
    """
    target_date = cycle_start + timedelta(days=day - 1)
    day_start = target_date.replace(hour=0, minute=0, second=0, microsecond=0)
    day_end = target_date.replace(hour=23, minute=59, second=59, microsecond=999999)

    record = await db["cycle_logs"].find_one({
        "user_id": user_id,
        "cycle_start_date": {
            "$gte": day_start,
            "$lte": day_end
        },
        "flow_score": {"$exists": True, "$ne": None}
    })
    if record and record.get("flow_score") is not None:
        return float(record["flow_score"])
    return None


async def get_parsed_cycle_history(
    db,
    user_id: str,
    limit: int = 12
) -> list[dict]:
    """
    Returns a cleaned, sorted list of cycle log dicts
    for a given user, filtered to valid gap ranges.

    Each dict contains:
      - start_date: datetime
      - end_date: datetime | None
      - cycle_length: int | None
      - symptoms: list[str]
      - flow_intensity: str | None
      - unusual_bleeding: bool | None
      - menses_score_day_1: float | None  (from daily log)
      - menses_score_day_2: float | None
      - menses_score_day_3: float | None
      - menses_score_day_7: float | None

    Suitable for passing directly to ML models.
    """
    logs = await db["cycle_logs"].find(
        {"user_id": user_id}
    ).sort("cycle_start_date", 1).to_list(length=limit * 2)

    parsed = []
    for i, log in enumerate(logs):
        start = log.get("cycle_start_date")
        if not start:
            continue

        # Calculate gap from previous log
        if i > 0:
            prev_start = logs[i - 1].get("cycle_start_date")
            if prev_start:
                gap = (start - prev_start).days
                if not (CYCLE_MIN_DAYS <= gap <= CYCLE_MAX_DAYS):
                    continue

        # Fetch per-day flow scores from cycle_logs
        day_1 = await get_day_flow_score(db, user_id, start, 1)
        day_2 = await get_day_flow_score(db, user_id, start, 2)
        day_3 = await get_day_flow_score(db, user_id, start, 3)
        day_7 = await get_day_flow_score(db, user_id, start, 7)

        parsed.append({
            "start_date": start,
            "end_date": log.get("cycle_end_date"),
            "cycle_length": log.get("cycle_length"),
            "symptoms": log.get("symptoms", []),
            "flow_intensity": log.get("flow_intensity"),
            "unusual_bleeding": log.get("unusual_bleeding"),
            "menses_score_day_1": day_1,
            "menses_score_day_2": day_2,
            "menses_score_day_3": day_3,
            "menses_score_day_7": day_7,
        })

        if len(parsed) >= limit:
            break

    return parsed
