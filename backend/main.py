
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import settings
from database.connection import db
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events"""
    # Startup
    logger.info("Starting up Edufy API...")
    await db.connect_db()
    logger.info("Database connected successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Edufy API...")
    await db.close_db()
    logger.info("Database connection closed")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Import routers
from app.routers import auth, student, faculty, admin, ai

# Include routers
app.include_router(auth.router)
app.include_router(student.router)
app.include_router(faculty.router)
app.include_router(admin.router)
app.include_router(ai.router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Edufy Smart Campus API",
        "version": settings.APP_VERSION,
        "status": "running"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}