from datetime import datetime, timedelta, timezone
import collections

async def get_dashboard_summary(user_id: str, db) -> dict:
    from bson import ObjectId
    
    user_id_obj = ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id
    
    # last_period_date
    cycle_cursor = db["cycle_logs"].find({"user_id": {"$in": [user_id, user_id_obj]}}).sort("cycle_start_date", -1).limit(1)
    cycle_logs = await cycle_cursor.to_list(length=1)
    
    last_period_date = None
    next_period_prediction = None
    if cycle_logs:
        last_period_date = cycle_logs[0].get("cycle_start_date")
        if last_period_date:
            # ML_PLACEHOLDER: replace with ml_service call when ready
            next_period_prediction = last_period_date + timedelta(days=28)
            
    # ML_PLACEHOLDER: replace with ml_service call when ready
    average_cycle_length = 28
    
    ninety_days_ago = datetime.now(timezone.utc) - timedelta(days=90)
    cycle_streak = await db["cycle_logs"].count_documents({
        "user_id": {"$in": [user_id, user_id_obj]}, 
        "cycle_start_date": {"$gte": ninety_days_ago}
    })
    
    cycles_logged = await db["cycle_logs"].count_documents({"user_id": {"$in": [user_id, user_id_obj]}})
    
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
    symptoms_cursor = db["daily_symptoms"].find({
        "user_id": {"$in": [user_id, user_id_obj]},
        "date": {"$gte": seven_days_ago}
    })
    symptoms_logs = await symptoms_cursor.to_list(length=None)
    
    mood_counts = {}
    symptom_counts = {}
    for log in symptoms_logs:
        mood = log.get("mood")
        if mood:
            mood_counts[mood] = mood_counts.get(mood, 0) + 1
        for symp in log.get("symptoms", []):
            symptom_counts[symp] = symptom_counts.get(symp, 0) + 1
            
    mood_this_week = "unknown"
    if mood_counts:
        mood_this_week = max(mood_counts, key=mood_counts.get)
        
    top_symptoms_this_week = [s for s, c in sorted(symptom_counts.items(), key=lambda x: x[1], reverse=True)][:3]
    if not top_symptoms_this_week:
        top_symptoms_this_week = []
        
    community_posts_count = await db["community_posts"].count_documents({"author_id": {"$in": [user_id, user_id_obj]}})
    
    return {
        "last_period_date": last_period_date.isoformat() if last_period_date else None,
        "next_period_prediction": next_period_prediction.isoformat() if next_period_prediction else None,
        "average_cycle_length": average_cycle_length,
        "cycle_streak": cycle_streak,
        "cycles_logged": cycles_logged,
        "mood_this_week": mood_this_week,
        "top_symptoms_this_week": top_symptoms_this_week,
        "community_posts_count": community_posts_count
    }

async def get_insights(user_id: str, db) -> dict:
    from bson import ObjectId
    user_id_obj = ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id

    cursor = db["cycle_logs"].find({"user_id": {"$in": [user_id, user_id_obj]}}).sort("cycle_start_date", 1)
    logs = await cursor.to_list(length=None)
    
    cycle_length_history = []
    for i, log in enumerate(logs):
        # ML_PLACEHOLDER: replace with ml_service call when ready
        length = log.get("cycle_length") or 28
        cycle_length_history.append({
            "cycle": f"Cycle {i+1:02d}",
            "length": length
        })
        
    symptoms_cursor = db["daily_symptoms"].find({"user_id": {"$in": [user_id, user_id_obj]}})
    all_symptoms_logs = await symptoms_cursor.to_list(length=None)
    
    symptom_counts = {}
    for log in all_symptoms_logs:
        for symp in log.get("symptoms", []):
            symptom_counts[symp] = symptom_counts.get(symp, 0) + 1
            
    symptom_frequency = [{"symptom": s, "count": c} for s, c in sorted(symptom_counts.items(), key=lambda x: x[1], reverse=True)]
    top_symptom = symptom_frequency[0]["symptom"] if symptom_frequency else None
    
    four_weeks_ago = datetime.now(timezone.utc) - timedelta(days=28)
    recent_mood_logs = []
    for log in all_symptoms_logs:
        dt = log.get("date")
        if dt and dt.replace(tzinfo=timezone.utc) >= four_weeks_ago and log.get("mood"):
            recent_mood_logs.append(log)
    
    # Map typical moods
    mood_map = {
        "awful": 1, "sad": 2, "terrible": 1, "angry": 2, "stressed": 2, "anxious": 2,
        "okay": 3, "neutral": 3, "fine": 3, "calm": 3,
        "good": 4, "happy": 4, "energetic": 4,
        "great": 5, "excellent": 5, "amazing": 5
    }
    
    weeks_data = {"WK 01": [], "WK 02": [], "WK 03": [], "WK 04": []}
    now = datetime.now(timezone.utc)
    for log in recent_mood_logs:
        log_date = log.get("date").replace(tzinfo=timezone.utc)
        days_ago = (now - log_date).days
        mood = log.get("mood", "").lower()
        score = mood_map.get(mood, 3) 
        
        if 0 <= days_ago < 7: weeks_data["WK 04"].append(score)
        elif 7 <= days_ago < 14: weeks_data["WK 03"].append(score)
        elif 14 <= days_ago < 21: weeks_data["WK 02"].append(score)
        elif 21 <= days_ago < 28: weeks_data["WK 01"].append(score)
        
    mood_trend = []
    if recent_mood_logs:
        for wk in ["WK 01", "WK 02", "WK 03", "WK 04"]:
            scores = weeks_data[wk]
            avg = sum(scores) / len(scores) if scores else 0
            mood_trend.append({"week": wk, "mood_score": round(avg, 1) if avg > 0 else 0})
            
    return {
        "cycle_length_history": cycle_length_history,
        "symptom_frequency": symptom_frequency,
        "mood_trend": mood_trend,
        "top_symptom": top_symptom
    }
