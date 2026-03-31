import asyncio
import random
from datetime import datetime, timedelta
import os
import sys

# Add backend directory to sys.path to resolve imports like 'database' or 'models' if needed
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database import connect_to_mongo, get_db, close_mongo_connection
from bson import ObjectId

async def main():
    await connect_to_mongo()
    db = get_db()
    
    # 1. Fetch an existing user
    user = await db["users"].find_one()
    if not user:
        print("No user found in the database. Please create a user first.")
        await close_mongo_connection()
        return
        
    user_id = str(user["_id"])
    print(f"Target User ID: {user_id} ({user.get('email', 'Unknown')})")
    
    # 2. Safety: Clear previous cycle_logs and daily_symptoms for this user
    delete_result = await db["cycle_logs"].delete_many({"user_id": user_id})
    print(f"Cleared {delete_result.deleted_count} previous cycle logs for testing.")
    
    symptoms_delete_result = await db["daily_symptoms"].delete_many({"user_id": user_id})
    print(f"Cleared {symptoms_delete_result.deleted_count} previous daily symptoms for testing.")
    
    # 3. Generate 8-12 cycle entries backwards from today
    num_cycles = random.randint(8, 12)
    symptoms_pool = ["cramps", "fatigue", "bloating", "headache", "acne"]
    mood_pool = ["happy", "sad", "irritated", "neutral"]
    flow_pool = ["light", "average", "heavy"]
    
    records = []
    
    # Randomly select which cycles will strictly have "cramps" and "fatigue" to guarantee the minimums
    cramps_indices = set(random.sample(range(num_cycles), max(3, num_cycles // 3)))
    fatigue_indices = set(random.sample(range(num_cycles), max(3, num_cycles // 3)))
    
    current_start_date = datetime.utcnow() - timedelta(days=random.randint(1, 10))  # Last cycle started few days ago

    for i in range(num_cycles):
        # We build the list from newest to oldest, inserting chronologically at the end
        cycle_length = random.randint(24, 34)
        period_length = random.randint(3, 7)
        
        cycle_end_date = current_start_date + timedelta(days=cycle_length - 1)
        
        # Determine symptoms ensuring minimum representation
        cycle_symptoms = []
        if i in cramps_indices:
            cycle_symptoms.append("cramps")
        if i in fatigue_indices:
            cycle_symptoms.append("fatigue")
            
        remaining_symptoms = [s for s in symptoms_pool if s not in cycle_symptoms]
        num_additional = max(0, random.randint(2, 4) - len(cycle_symptoms))
        cycle_symptoms.extend(random.sample(remaining_symptoms, num_additional))
        
        # Mood and flow
        mood = random.choice(mood_pool)
        flow = random.choice(flow_pool)
        
        record = {
            "user_id": user_id,
            "cycle_start_date": current_start_date,
            "cycle_end_date": cycle_end_date,
            "cycle_length": cycle_length,
            "flow_intensity": flow,
            "symptoms": [s.capitalize() for s in cycle_symptoms],
            "mood": mood,
            "notes": None,
            "created_at": current_start_date  # Maps to logged_at/created_at schema
        }
        records.append(record)
        
        # Step back in time for the prev cycle
        current_start_date = current_start_date - timedelta(days=cycle_length)
        
    # Reverse to make chronological for insertion and visual debugging
    records.reverse()
    
    # 4. Insert records
    insert_result = await db["cycle_logs"].insert_many(records)
    print(f"\nSeeded {len(insert_result.inserted_ids)} cycle_logs successfully.")

    # 5. Generate and insert daily symptoms
    daily_records = []
    for log in records:
        start = log["cycle_start_date"]
        
        # Simulate 4-6 period days of symptoms per cycle
        for i in range(random.randint(4, 6)):
            day = start + timedelta(days=i)
            
            # Introduce slight day-to-day variation for more dynamic charts
            daily_symptoms_list = list(log["symptoms"])
            if len(daily_symptoms_list) > 1 and random.random() > 0.5:
                daily_symptoms_list.remove(random.choice(daily_symptoms_list))
                
            daily_moods = ["happy", "sad", "irritated", "neutral"]
            daily_mood = log["mood"] if random.random() > 0.3 else random.choice(daily_moods)

            daily_records.append({
                "user_id": user_id,
                "date": day,
                "symptoms": daily_symptoms_list,
                "mood": daily_mood
            })

    if daily_records:
        daily_insert_result = await db["daily_symptoms"].insert_many(daily_records)
        print(f"Seeded {len(daily_insert_result.inserted_ids)} daily_symptoms successfully.")
    
    # Output sample of 2 records
    print("\n--- SAMPLE INSERTED CYCLE DOCUMENTS ---")
    for i, rec in enumerate(records[-2:]):
        print(f"Sample {i+1}:")
        print(f"  Cycle: {rec['cycle_start_date'].strftime('%Y-%m-%d')} to {rec['cycle_end_date'].strftime('%Y-%m-%d')}")
        print(f"  Length: {rec['cycle_length']} days")
        print(f"  Symptoms: {rec['symptoms']}")
        print(f"  Mood: {rec['mood']}")
    
    print("\n--- SAMPLE INSERTED DAILY SYMPTOMS ---")
    if daily_records:
        for i, rec in enumerate(daily_records[-2:]):
            print(f"Sample {i+1}:")
            print(f"  Date: {rec['date'].strftime('%Y-%m-%d')}")
            print(f"  Symptoms: {rec['symptoms']}")
            print(f"  Mood: {rec['mood']}")
            
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(main())
