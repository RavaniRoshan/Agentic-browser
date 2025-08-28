"""
Agentic Browser Backend - FastAPI Main Application
Handles browser automation, AI agent orchestration, and task management
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
from typing import List, Optional

from app.core.config import settings
from app.core.database import engine, create_db_and_tables
from app.api.v1.api import api_router
from app.models.task import Task
from app.services.browser_service import BrowserService
from app.services.ai_service import AIService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info("Starting Agentic Browser Backend...")
    
    # Create database tables
    create_db_and_tables()
    
    # Initialize services
    browser_service = BrowserService()
    ai_service = AIService()
    
    # Store services in app state
    app.state.browser_service = browser_service
    app.state.ai_service = ai_service
    
    logger.info("Backend services initialized successfully")
    
    yield
    
    # Cleanup
    logger.info("Shutting down Agentic Browser Backend...")
    await browser_service.cleanup()

# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-powered browser automation backend with GPT-OSS integration",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Agentic Browser Backend API",
        "version": "1.0.0",
        "status": "running",
        "docs": f"{settings.API_V1_STR}/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "services": {
            "database": "connected",
            "browser": "ready",
            "ai": "ready"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )