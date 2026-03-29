from datetime import timedelta, datetime, time
from typing import Optional, List
from bson import ObjectId
from models.cycle_model import CycleCreateReq, CycleUpdateReq
from database import get_db
from fastapi import HTTPException
from services.cycle_history import get_parsed_cycle_history, CYCLE_MIN_DAYS, CYCLE_MAX_DAYS
import logging

logger = logging.getLogger(__name__)

def safe_object_id(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")

class TrackerService:
    @staticmethod
    async def get_user_cycles(user_id: str) -> List[dict]:
        db = get_db()
        cursor = db["cycle_logs"].find({"user_id": user_id}).sort("cycle_start_date", -1)
        # Motor AsyncIOMotorCursor requires await to fetch results
        cycles = await cursor.to_list(length=100)
        return cycles

    @staticmethod
    async def get_tracker_summary(user_id: str) -> dict:
        db = get_db()
        parsed = await get_parsed_cycle_history(db, user_id)

        # Calculate average cycle length from cleaned, gap-filtered history
        avg_length = 28  # default
        if len(parsed) >= 2:
            total_days = 0
            valid_gaps = 0
            for i in range(len(parsed) - 1):
                gap = (parsed[i + 1]["start_date"] - parsed[i]["start_date"]).days
                if CYCLE_MIN_DAYS <= gap <= CYCLE_MAX_DAYS:
                    total_days += gap
                    valid_gaps += 1
            if valid_gaps > 0:
                avg_length = total_days // valid_gaps

        prediction = None
        if parsed:
            last_start = parsed[-1]["start_date"]
            prediction = last_start + timedelta(days=avg_length)

        # Fetch full cycle list for past_cycles (including raw logs with IDs)
        cycles = await TrackerService.get_user_cycles(user_id)
        for c in cycles:
            c["id"] = str(c.pop("_id", ""))

        return {
            "average_cycle_length": avg_length,
            "next_period_prediction": prediction,
            "past_cycles": cycles
        }

    @staticmethod
    async def log_cycle(user_id: str, data: CycleCreateReq) -> dict:
        db = get_db()
        
        # Prevent duplicate log for same day
        today = datetime.utcnow().date()
        today_start = datetime(today.year, today.month, today.day)
        today_end = today_start + timedelta(days=1)
        existing = await db["cycle_logs"].find_one({
            "user_id": user_id,
            "cycle_start_date": {"$gte": today_start, "$lt": today_end}
        })
        if existing:
            raise HTTPException(
                status_code=409,
                detail="A cycle log already exists for today. Use PATCH to update it."
            )
        
        log_data = data.model_dump(exclude_unset=True)
        log_data["user_id"] = user_id
        log_data["created_at"] = datetime.utcnow()
        
        result = await db["cycle_logs"].insert_one(log_data)
        created = await db["cycle_logs"].find_one({"_id": result.inserted_id})
        created["id"] = str(created.pop("_id", ""))
        return created

    @staticmethod
    async def update_cycle(user_id: str, cycle_id: str, data: CycleUpdateReq) -> Optional[dict]:
        db = get_db()
        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            return None
            
        try:
            cycle_oid = ObjectId(cycle_id)
        except Exception as e:
            logger.error(f"[ERROR] TrackerService.update_cycle: {e}", exc_info=True)
            raise HTTPException(status_code=400, detail="Invalid cycle ID format")
            
        result = await db["cycle_logs"].update_one(
            {"_id": cycle_oid, "user_id": user_id},
            {"$set": update_data}
        )
        if result.modified_count == 0:
            return None
            
        updated = await db["cycle_logs"].find_one({"_id": safe_object_id(cycle_id)})
        updated["id"] = str(updated.pop("_id", ""))
        return updated

    @staticmethod
    async def log_mood_today(user_id: str, mood: str, db=None) -> dict:
        if db is None:
            db = get_db()
        from pymongo import ReturnDocument
        
        # Get start and end of today in UTC
        now = datetime.utcnow()
        today_start = datetime.combine(now.date(), time.min)
        today_end = today_start + timedelta(days=1)
        
        # Find today's cycle log for this user
        existing = await db["cycle_logs"].find_one({
            "user_id": user_id,
            "cycle_start_date": {
                "$gte": today_start,
                "$lt": today_end
            }
        })
        
        if existing:
            # Update existing log with mood
            updated = await db["cycle_logs"].find_one_and_update(
                {"_id": existing["_id"]},
                {"$set": {"mood": mood}},
                return_document=ReturnDocument.AFTER
            )
            updated["id"] = str(updated.pop("_id", ""))
            return updated
        else:
            # Create minimal log with just mood for today
            new_log = {
                "user_id": user_id,
                "cycle_start_date": now,
                "mood": mood,
                "symptoms": [],
                "flow_intensity": None,
                "notes": None,
                "created_at": now
            }
            result = await db["cycle_logs"].insert_one(new_log)
            new_log["id"] = str(result.inserted_id)
            new_log.pop("_id", None)
            return new_log

tracker_service = TrackerService()
