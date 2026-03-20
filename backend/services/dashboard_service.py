from datetime import datetime, timedelta, timezone

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

    # cycle_length_history
    cycle_pipeline = [
        {"$match": {"user_id": {"$in": [user_id, user_id_obj]}}},
        {"$sort": {"cycle_start_date": 1}},
        {"$project": {"cycle_start_date": 1, "cycle_length": 1}}
    ]
    cycle_cursor = db["cycle_logs"].aggregate(cycle_pipeline)
    logs = await cycle_cursor.to_list(length=100)  # Bounded — ML pipeline will replace this
    
    cycle_length_history = []
    for i, log in enumerate(logs):
        # ML_PLACEHOLDER: replace with ml_service call when ready
        length = log.get("cycle_length") or 28
        cycle_length_history.append({
            "cycle": f"Cycle {i+1:02d}",
            "length": length
        })
        
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
    
    mood_map_expr = {
        "$switch": {
            "branches": [
                {"case": {"$in": [{"$toLower": "$mood"}, ["awful", "terrible"]]}, "then": 1},
                {"case": {"$in": [{"$toLower": "$mood"}, ["sad", "angry", "stressed", "anxious"]]}, "then": 2},
                {"case": {"$in": [{"$toLower": "$mood"}, ["okay", "neutral", "fine", "calm"]]}, "then": 3},
                {"case": {"$in": [{"$toLower": "$mood"}, ["good", "happy", "energetic"]]}, "then": 4},
                {"case": {"$in": [{"$toLower": "$mood"}, ["great", "excellent", "amazing"]]}, "then": 5}
            ],
            "default": 3
        }
    }
    
    mood_trend_pipeline = [
        {"$match": {
            "user_id": {"$in": [user_id, user_id_obj]},
            "cycle_start_date": {"$gte": four_weeks_ago},
            "mood": {"$nin": [None, ""]}
        }},
        {"$addFields": {
            "score": mood_map_expr,
            "days_ago": {
                "$floor": {
                    "$divide": [
                        {"$subtract": [datetime.now(timezone.utc), "$cycle_start_date"]},
                        1000 * 60 * 60 * 24
                    ]
                }
            }
        }},
        {"$addFields": {
            "week_idx": {
                "$switch": {
                    "branches": [
                        {"case": {"$lt": ["$days_ago", 7]}, "then": "WK 04"},
                        {"case": {"$lt": ["$days_ago", 14]}, "then": "WK 03"},
                        {"case": {"$lt": ["$days_ago", 21]}, "then": "WK 02"},
                        {"case": {"$lt": ["$days_ago", 28]}, "then": "WK 01"}
                    ],
                    "default": "Older"
                }
            }
        }},
        {"$match": {"week_idx": {"$ne": "Older"}}},
        {"$group": {
            "_id": "$week_idx",
            "avg_score": {"$avg": "$score"}
        }},
        {"$sort": {"_id": 1}}
    ]
    
    mood_cursor = db["cycle_logs"].aggregate(mood_trend_pipeline)
    mood_res = await mood_cursor.to_list(length=4)  # Bounded — exactly 4 weekly groupings (WK 01–04)

    res_map = {doc["_id"]: doc["avg_score"] for doc in mood_res}
    mood_trend = []
    
    if mood_res:
        for wk in ["WK 01", "WK 02", "WK 03", "WK 04"]:
            val = res_map.get(wk, 0)
            mood_trend.append({"week": wk, "mood_score": round(val, 1) if val > 0 else 0})
            
    return {
        "cycle_length_history": cycle_length_history,
        "symptom_frequency": symptom_frequency,
        "mood_trend": mood_trend,
        "top_symptom": top_symptom
    }
