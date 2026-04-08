import os 
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv

import logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s — %(name)s — %(levelname)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger(__name__)

from database import connect_to_mongo, close_mongo_connection, get_db
from config import limiter
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

load_dotenv()

# Lifecycle events for MongoDB connection
scheduler = AsyncIOScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    
    # Wire purge job after DB is connected so get_db() is ready
    from services.user_service import purge_scheduled_deletions
    async def run_purge():
        db = get_db()
        await purge_scheduled_deletions(db)
    
    import pytz
    scheduler.add_job(
        run_purge,
        CronTrigger(hour=2, minute=0, timezone=pytz.utc),
        id="purge_scheduled_deletions",
        replace_existing=True
    )
    scheduler.start()
    logger.info("[SCHEDULER] Deletion purge job scheduled — runs daily at 02:00 UTC")
    
    yield
    
    # Shutdown
    scheduler.shutdown()
    logger.info("[SCHEDULER] Scheduler stopped")
    await close_mongo_connection()

app = FastAPI(
    title="Petal Menstrual Health Platform API",
    description="API for Petal - Menstrual Health Awareness Platform",
    version="1.0.0",
    lifespan=lifespan
)

# Register rate limiter exception handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174")
origins = [origin.strip() for origin in allowed_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global rate limit example (can be overridden on specific endpoints)
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    # We can add custom global middlewares here
    response = await call_next(request)
    return response

# Root endpoint for health check
@app.get("/")
@limiter.limit("50/minute")
async def root(request: Request):
    return {"message": "Petal API is running."}

from routes.auth import router as auth_router
from routes.chatbot import router as chatbot_router
from routes.quiz import router as quiz_router
from routes.period_tracker import router as tracker_router
from routes.community import router as community_router
from routes.users import router as users_router
from routes.education import router as education_router
from routes.reports import router as reports_router
from routes.dashboard import router as dashboard_router
from routes.admin_articles import router as admin_articles_router
from routes.admin_myths import router as admin_myths_router
from routes.admin_quizzes import router as admin_quizzes_router
from routes.admin_community import router as admin_community_router
from routes.admin_users import router as admin_users_router
from routes.admin_videos import router as admin_videos_router
# DEPRECATED: blogs merged into articles
# from routes.admin_blogs import router as admin_blogs_router
from routes.admin_stats import router as admin_stats_router

app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(chatbot_router, prefix="/api", tags=["Chatbot"])
app.include_router(quiz_router, prefix="/api/quizzes", tags=["Quiz"])
app.include_router(tracker_router, prefix="/api/period-tracker", tags=["Tracker"])
app.include_router(community_router, prefix="/api/community", tags=["Community"])
app.include_router(education_router, prefix="/api/education", tags=["Education"])
app.include_router(reports_router, prefix="/api/reports", tags=["Reports"])
app.include_router(dashboard_router, prefix="/api", tags=["Dashboard"])
app.include_router(admin_articles_router, prefix="/api/admin", tags=["Admin"])
app.include_router(admin_myths_router, prefix="/api/admin", tags=["Admin"])
app.include_router(admin_quizzes_router, prefix="/api/admin", tags=["Admin"])
app.include_router(admin_community_router, prefix="/api/admin", tags=["Admin"])
app.include_router(admin_users_router, prefix="/api/admin", tags=["Admin"])
app.include_router(admin_videos_router, prefix="/api/admin", tags=["Admin"])
# app.include_router(admin_blogs_router, prefix="/api/admin", tags=["Admin"])
app.include_router(admin_stats_router, prefix="/api/admin", tags=["Admin"])

