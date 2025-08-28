"""
Task management endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from sqlmodel import Session, select
from typing import List
import logging
from datetime import datetime

from app.core.database import get_session
from app.models.task import (
    BrowserTask, 
    BrowserTaskCreate, 
    BrowserTaskUpdate, 
    BrowserTaskResponse,
    TaskStatus
)
from app.services.browser_service import BrowserService
from app.services.ai_service import AIService

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/", response_model=BrowserTaskResponse)
async def create_task(
    task_data: BrowserTaskCreate,
    session: Session = Depends(get_session)
):
    """Create a new browser automation task"""
    try:
        # Create new task
        task = BrowserTask(
            name=task_data.name,
            description=task_data.description,
            url=task_data.url,
            status=TaskStatus.PENDING
        )
        
        session.add(task)
        session.commit()
        session.refresh(task)
        
        logger.info(f"Created new task: {task.id}")
        
        return BrowserTaskResponse(
            id=task.id,
            name=task.name,
            description=task.description,
            url=task.url,
            status=task.status,
            created_at=task.created_at,
            updated_at=task.updated_at,
            completed_at=task.completed_at,
            result=task.result,
            actions=task.actions
        )
        
    except Exception as e:
        logger.error(f"Failed to create task: {e}")
        raise HTTPException(status_code=500, detail="Failed to create task")

@router.get("/", response_model=List[BrowserTaskResponse])
async def get_tasks(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session)
):
    """Get all browser automation tasks"""
    try:
        statement = select(BrowserTask).offset(skip).limit(limit).order_by(BrowserTask.created_at.desc())
        tasks = session.exec(statement).all()
        
        return [
            BrowserTaskResponse(
                id=task.id,
                name=task.name,
                description=task.description,
                url=task.url,
                status=task.status,
                created_at=task.created_at,
                updated_at=task.updated_at,
                completed_at=task.completed_at,
                result=task.result,
                actions=task.actions
            )
            for task in tasks
        ]
        
    except Exception as e:
        logger.error(f"Failed to get tasks: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve tasks")

@router.get("/{task_id}", response_model=BrowserTaskResponse)
async def get_task(
    task_id: str,
    session: Session = Depends(get_session)
):
    """Get a specific browser automation task"""
    try:
        task = session.get(BrowserTask, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        return BrowserTaskResponse(
            id=task.id,
            name=task.name,
            description=task.description,
            url=task.url,
            status=task.status,
            created_at=task.created_at,
            updated_at=task.updated_at,
            completed_at=task.completed_at,
            result=task.result,
            actions=task.actions
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get task {task_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve task")

@router.post("/{task_id}/execute")
async def execute_task(
    task_id: str,
    background_tasks: BackgroundTasks,
    request: Request,
    session: Session = Depends(get_session)
):
    """Execute a browser automation task"""
    try:
        task = session.get(BrowserTask, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        if task.status == TaskStatus.RUNNING:
            raise HTTPException(status_code=400, detail="Task is already running")
        
        # Update task status to running
        task.status = TaskStatus.RUNNING
        task.updated_at = datetime.utcnow()
        session.add(task)
        session.commit()
        
        # Execute task in background
        background_tasks.add_task(
            _execute_task_background,
            task_id,
            request.app.state.browser_service,
            request.app.state.ai_service
        )
        
        logger.info(f"Started execution of task: {task_id}")
        
        return {"message": "Task execution started", "task_id": task_id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to execute task {task_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to execute task")

@router.put("/{task_id}", response_model=BrowserTaskResponse)
async def update_task(
    task_id: str,
    task_update: BrowserTaskUpdate,
    session: Session = Depends(get_session)
):
    """Update a browser automation task"""
    try:
        task = session.get(BrowserTask, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        # Update fields
        if task_update.name is not None:
            task.name = task_update.name
        if task_update.description is not None:
            task.description = task_update.description
        if task_update.url is not None:
            task.url = task_update.url
        if task_update.status is not None:
            task.status = task_update.status
        
        task.updated_at = datetime.utcnow()
        
        session.add(task)
        session.commit()
        session.refresh(task)
        
        logger.info(f"Updated task: {task_id}")
        
        return BrowserTaskResponse(
            id=task.id,
            name=task.name,
            description=task.description,
            url=task.url,
            status=task.status,
            created_at=task.created_at,
            updated_at=task.updated_at,
            completed_at=task.completed_at,
            result=task.result,
            actions=task.actions
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update task {task_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to update task")

@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    session: Session = Depends(get_session)
):
    """Delete a browser automation task"""
    try:
        task = session.get(BrowserTask, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        session.delete(task)
        session.commit()
        
        logger.info(f"Deleted task: {task_id}")
        
        return {"message": "Task deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete task {task_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete task")

async def _execute_task_background(
    task_id: str,
    browser_service: BrowserService,
    ai_service: AIService
):
    """Background task execution"""
    from app.core.database import engine
    
    try:
        with Session(engine) as session:
            task = session.get(BrowserTask, task_id)
            if not task:
                logger.error(f"Task {task_id} not found for background execution")
                return
            
            # Execute the task
            result = await browser_service.execute_task(task)
            
            # Update task with results
            task.result = result
            task.updated_at = datetime.utcnow()
            task.completed_at = datetime.utcnow()
            
            if result.get("success"):
                task.status = TaskStatus.COMPLETED
            else:
                task.status = TaskStatus.FAILED
            
            session.add(task)
            session.commit()
            
            logger.info(f"Background execution completed for task: {task_id}")
            
    except Exception as e:
        logger.error(f"Background task execution failed for {task_id}: {e}")
        
        # Update task status to failed
        try:
            with Session(engine) as session:
                task = session.get(BrowserTask, task_id)
                if task:
                    task.status = TaskStatus.FAILED
                    task.result = {"success": False, "error": str(e)}
                    task.updated_at = datetime.utcnow()
                    task.completed_at = datetime.utcnow()
                    session.add(task)
                    session.commit()
        except Exception as update_error:
            logger.error(f"Failed to update task status after error: {update_error}")