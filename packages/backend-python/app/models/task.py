"""
Task model for browser automation tasks
"""

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class TaskStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class ActionType(str, Enum):
    CLICK = "click"
    TYPE = "type"
    SCROLL = "scroll"
    WAIT = "wait"
    EXTRACT = "extract"
    NAVIGATE = "navigate"
    SCREENSHOT = "screenshot"

class BrowserAction(SQLModel, table=True):
    """Browser action model"""
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    task_id: str = Field(foreign_key="browsertask.id")
    type: ActionType
    selector: Optional[str] = None
    value: Optional[str] = None
    description: str
    completed: bool = False
    order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationship
    task: Optional["BrowserTask"] = Relationship(back_populates="actions")

class TaskResult(SQLModel):
    """Task execution result"""
    success: bool
    data: Optional[Dict[str, Any]] = None
    screenshots: Optional[List[str]] = None
    error: Optional[str] = None
    execution_time: int  # milliseconds

class BrowserTask(SQLModel, table=True):
    """Browser task model"""
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    name: str
    description: str
    url: str
    status: TaskStatus = TaskStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None
    
    # Relationships
    actions: List[BrowserAction] = Relationship(back_populates="task")

# Pydantic models for API
class BrowserTaskCreate(SQLModel):
    name: str
    description: str
    url: str

class BrowserTaskUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    status: Optional[TaskStatus] = None

class BrowserTaskResponse(SQLModel):
    id: str
    name: str
    description: str
    url: str
    status: TaskStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None
    actions: List[BrowserAction] = []