from typing import List

async def get_articles(db) -> list:
    cursor = db["education_content"].find({})
    results = []
    async for doc in cursor:
        results.append({
            "id": str(doc["_id"]),
            "title": doc.get("title", ""),
            "content": doc.get("content", "")
        })
    return results

# Following the pattern asked for myth-facts in previous Turn (Step 93)
# just in case it's needed shortly, but focusing on the requested articles first.
async def get_myth_facts(db) -> list:
    cursor = db["myth_facts"].find({})
    results = []
    async for doc in cursor:
        results.append({
            "id": str(doc["_id"]),
            "myth": doc["myth"],
            "fact": doc["fact"]
        })
    return results
