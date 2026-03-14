from datetime import timedelta, datetime
from typing import Optional, List
from bson import ObjectId
from models.cycle_model import CycleCreateReq, CycleUpdateReq
from database import get_db

class TrackerService:
    @staticmethod
    async def get_user_cycles(user_id: str) -> List[dict]:
        db = get_db()
        cursor = db["cycle_logs"].find({"user_id": user_id}).sort("cycle_start_date", -1)
        cycles = await cursor.to_list(length=100)
        return cycles

    @staticmethod
    async def get_tracker_summary(user_id: str) -> dict:
        cycles = await TrackerService.get_user_cycles(user_id)
        
        # Calculate average cycle length (gap between start dates)
        avg_length = 28 # default
        if len(cycles) >= 2:
            # Cycles are sorted descending (latest first)
            total_days = 0
            valid_gaps = 0
            for i in range(len(cycles) - 1):
                start_current = cycles[i]["cycle_start_date"]
                start_previous = cycles[i+1]["cycle_start_date"]
                gap = (start_current - start_previous).days
                if 20 <= gap <= 45: # Consider only reasonable gaps
                    total_days += gap
                    valid_gaps += 1
            if valid_gaps > 0:
                avg_length = total_days // valid_gaps

        prediction = None
        if len(cycles) > 0:
            last_start = cycles[0]["cycle_start_date"]
            prediction = last_start + timedelta(days=avg_length)

        # Convert ObjectIds to strings before returning
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
        except Exception:
            return None
            
        result = await db["cycle_logs"].update_one(
            {"_id": cycle_oid, "user_id": user_id},
            {"$set": update_data}
        )
        if result.modified_count == 0:
            return None
            
        updated = await db["cycle_logs"].find_one({"_id": ObjectId(cycle_id)})
        updated["id"] = str(updated.pop("_id", ""))
        return updated

tracker_service = TrackerService()
