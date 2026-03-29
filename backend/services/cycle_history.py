# ML_HOOKUP: get_parsed_cycle_history() is the single
# entry point for ML models to receive standardized
# cycle data. To integrate:
#   1. Import this function in your ml_service.py
#   2. Pass the returned list directly to model.predict()
#   3. Replace the fallback logic in tracker_service.py
#      and dashboard_service.py with model output

from datetime import datetime
from typing import Optional

# Unified cycle gap bounds — matched across all services
CYCLE_MIN_DAYS = 20
CYCLE_MAX_DAYS = 45


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

        parsed.append({
            "start_date": start,
            "end_date": log.get("cycle_end_date"),
            "cycle_length": log.get("cycle_length"),
            "symptoms": log.get("symptoms", []),
            "flow_intensity": log.get("flow_intensity"),
        })

        if len(parsed) >= limit:
            break

    return parsed
