from datetime import datetime, timedelta, timezone
from services.cycle_history import get_parsed_cycle_history, CYCLE_MIN_DAYS, CYCLE_MAX_DAYS
from services.ml_service import predict_next_period, ML_AVAILABLE

async def calculate_cycle_streak(user_id: str, db) -> int:
    """
    Returns the number of consecutive months the user has
    logged at least one cycle. Checks backwards from current
    month — stops at first month with no log.
    """
    from dateutil.relativedelta import relativedelta
    from bson import ObjectId
    user_id_obj = ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id
    
    streak = 0
    check_date = datetime.utcnow()
    
    for _ in range(12):  # check up to 12 months back
        month_start = datetime(check_date.year, check_date.month, 1)
        month_end = month_start + relativedelta(months=1)
        
        count = await db["cycle_logs"].count_documents({
            "user_id": {"$in": [user_id, user_id_obj]},
            "cycle_start_date": {
                "$gte": month_start,
                "$lt": month_end
            }
        })
        
        if count > 0:
            streak += 1
            check_date = check_date - relativedelta(months=1)
        else:
            break
            
    return streak

async def get_dashboard_summary(user_id: str, db, user: dict = None) -> dict:
    from bson import ObjectId
    user_id_obj = ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id
    
    # Get parsed, gap-filtered cycle history via shared utility
    parsed = await get_parsed_cycle_history(db, user_id)

    # Use ML model if available and enough history exists (≥3 cycles)
    next_period_prediction = None
    average_cycle_length = 28
    avg = 28
    ml_driven = False

    if ML_AVAILABLE and len(parsed) >= 3 and user is not None:
        try:
            ml_result = predict_next_period(parsed, user)
            avg = ml_result["predicted_cycle_length"]
            next_period_prediction = ml_result.get("next_period_date")  # ISO string from ml_service
            average_cycle_length = avg
            ml_driven = ml_result.get("ml_driven", False)
        except Exception:
            ml_result = None
    else:
        ml_result = None

    if not ML_AVAILABLE or len(parsed) < 3 or ml_result is None:
        if len(parsed) >= 2:
            # Calculate actual average from cleaned history
            gaps = []
            for i in range(len(parsed) - 1):
                gap = (parsed[i + 1]["start_date"] - parsed[i]["start_date"]).days
                if CYCLE_MIN_DAYS <= gap <= CYCLE_MAX_DAYS:
                    gaps.append(gap)
            avg = round(sum(gaps) / len(gaps)) if gaps else 28
        else:
            avg = 28
        average_cycle_length = avg
        # last_period_date used to compute next_period_prediction in rule-based path
        logs = await db["cycle_logs"].find(
            {"user_id": {"$in": [user_id, user_id_obj]}}
        ).sort("cycle_start_date", -1).limit(6).to_list(6)
        last_period_date = logs[0]["cycle_start_date"] if logs else None
        next_period_prediction = (last_period_date + timedelta(days=avg)).isoformat() if last_period_date else None
    else:
        # ML path: still need last_period_date for the response
        logs = await db["cycle_logs"].find(
            {"user_id": {"$in": [user_id, user_id_obj]}}
        ).sort("cycle_start_date", -1).limit(6).to_list(6)
        last_period_date = logs[0]["cycle_start_date"] if logs else None
    
    cycle_streak = await calculate_cycle_streak(user_id, db)
    
    cycles_logged = await db["cycle_logs"].count_documents({"user_id": {"$in": [user_id, user_id_obj]}})
    
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)

    # mood_this_week
    mood_pipeline = [
        {"$match": {"user_id": {"$in": [user_id, user_id_obj]}, "cycle_start_date": {"$gte": seven_days_ago}, "mood": {"$nin": [None, ""]}}},
        {"$group": {"_id": "$mood", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 1}
    ]
    mood_cursor = db["cycle_logs"].aggregate(mood_pipeline)
    mood_res = await mood_cursor.to_list(length=1)
    mood_this_week = mood_res[0]["_id"] if mood_res else "unknown"
        
    # top_symptoms_this_week
    symp_pipeline = [
        {"$match": {"user_id": {"$in": [user_id, user_id_obj]}, "cycle_start_date": {"$gte": seven_days_ago}}},
        {"$unwind": "$symptoms"},
        {"$group": {"_id": "$symptoms", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 3}
    ]
    symp_cursor = db["cycle_logs"].aggregate(symp_pipeline)
    symp_res = await symp_cursor.to_list(length=3)
    top_symptoms_this_week = [s["_id"] for s in symp_res]
        
    community_posts_count = await db["community_posts"].count_documents({"author.user_id": {"$in": [user_id, str(user_id_obj)]}})
    
    return {
        "last_period_date": last_period_date.isoformat() if last_period_date else None,
        "next_period_prediction": next_period_prediction,  # already ISO string from both paths
        "average_cycle_length": average_cycle_length,
        "cycle_streak": cycle_streak,
        "cycles_logged": cycles_logged,
        "mood_this_week": mood_this_week,
        "top_symptoms_this_week": top_symptoms_this_week,
        "community_posts_count": community_posts_count,
        "ml_driven": ml_driven,
    }

async def get_insights(user_id: str, db) -> dict:
    from bson import ObjectId
    user_id_obj = ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id

    # cycle_length_history
    parsed = await get_parsed_cycle_history(db, user_id)
    cycle_length_history = []
    
    # Render historic cycles safely
    for i, log in enumerate(parsed):
        if log.get("cycle_length") is not None:
            cycle_length_history.append({
                "cycle": f"Cycle {i+1:02d}",
                "length": log["cycle_length"]
            })
            
    # ML_PLACEHOLDER REPLACEMENT: Predict the upcoming cycle length and graph it!
    if ML_AVAILABLE and len(parsed) >= 3:
        try:
            user = await db["users"].find_one({"_id": {"$in": [user_id, user_id_obj]}})
            if user:
                ml_res = predict_next_period(parsed, user)
                cycle_length_history.append({
                    "cycle": "AI Predicted",
                    "length": ml_res["predicted_cycle_length"]
                })
        except Exception as e:
            pass
        
    # symptom_frequency
    freq_pipeline = [
        {"$match": {"user_id": {"$in": [user_id, user_id_obj]}}},
        {"$unwind": "$symptoms"},
        {"$group": {"_id": "$symptoms", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    freq_cursor = db["cycle_logs"].aggregate(freq_pipeline)
    freq_res = await freq_cursor.to_list(length=50)  # Bounded — top 50 symptoms is more than enough
    
    symptom_frequency = [{"symptom": s["_id"], "count": s["count"]} for s in freq_res]
    top_symptom = symptom_frequency[0]["symptom"] if symptom_frequency else None
    
    four_weeks_ago = datetime.now(timezone.utc) - timedelta(days=28)
    
    # Query daily_symptoms for the last 4 weeks
    daily_symptoms_cursor = db["daily_symptoms"].find({
        "user_id": {"$in": [user_id, user_id_obj]},
        "date": {"$gte": four_weeks_ago}
    })
    daily_logs = await daily_symptoms_cursor.to_list(100)
    
    # Build mood_trend
    mood_trend = []
    for log in daily_logs:
        if log.get("mood"):
            mood_trend.append({
                "date": log["date"].strftime("%Y-%m-%d"),
                "mood": log["mood"]
            })
            
    # Build symptom_trend
    trend = {}
    for log in daily_logs:
        date_str = log["date"].strftime("%Y-%m-%d")
        
        if date_str not in trend:
            trend[date_str] = {"date": date_str, "cramps": 0, "fatigue": 0}
            
        symptoms = [s.lower() for s in log.get("symptoms", [])]
        
        if "cramps" in symptoms:
            trend[date_str]["cramps"] += 1
        if "fatigue" in symptoms:
            trend[date_str]["fatigue"] += 1
            
    symptom_trend = list(trend.values())
    symptom_trend = sorted(symptom_trend, key=lambda x: x["date"])

    return {
        "cycle_length_history": cycle_length_history,
        "symptom_frequency": symptom_frequency,
        "mood_trend": mood_trend,
        "top_symptom": top_symptom,
        "symptom_trend": symptom_trend
    }
