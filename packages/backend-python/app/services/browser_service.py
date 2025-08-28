"""
Browser automation service using Playwright
"""

from playwright.async_api import async_playwright, Browser, BrowserContext, Page
from typing import List, Dict, Any, Optional
import asyncio
import logging
import base64
from datetime import datetime

from app.models.task import BrowserTask, BrowserAction, ActionType, TaskStatus
from app.core.config import settings

logger = logging.getLogger(__name__)

class BrowserService:
    """Browser automation service"""
    
    def __init__(self):
        self.playwright = None
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.page: Optional[Page] = None
        
    async def initialize(self):
        """Initialize Playwright browser"""
        try:
            if not self.playwright:
                self.playwright = await async_playwright().start()
                
            if not self.browser:
                self.browser = await self.playwright.chromium.launch(
                    headless=settings.BROWSER_HEADLESS,
                    args=['--no-sandbox', '--disable-dev-shm-usage']
                )
                
            if not self.context:
                self.context = await self.browser.new_context(
                    viewport={'width': 1920, 'height': 1080},
                    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                )
                
            if not self.page:
                self.page = await self.context.new_page()
                
            logger.info("Browser service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize browser service: {e}")
            raise
    
    async def execute_task(self, task: BrowserTask) -> Dict[str, Any]:
        """Execute a browser automation task"""
        try:
            await self.initialize()
            
            start_time = datetime.utcnow()
            screenshots = []
            extracted_data = {}
            
            # Navigate to the target URL
            logger.info(f"Navigating to {task.url}")
            await self.page.goto(task.url, timeout=settings.BROWSER_TIMEOUT)
            
            # Take initial screenshot
            if settings.ENVIRONMENT == "development":
                screenshot = await self.page.screenshot()
                screenshots.append(base64.b64encode(screenshot).decode())
            
            # Execute actions (placeholder for AI-generated actions)
            actions = await self._generate_actions_from_description(task.description, task.url)
            
            for action in actions:
                try:
                    await self._execute_action(action)
                    action.completed = True
                    logger.info(f"Completed action: {action.description}")
                    
                except Exception as e:
                    logger.error(f"Failed to execute action {action.description}: {e}")
                    action.completed = False
            
            # Take final screenshot
            if settings.ENVIRONMENT == "development":
                screenshot = await self.page.screenshot()
                screenshots.append(base64.b64encode(screenshot).decode())
            
            # Calculate execution time
            execution_time = int((datetime.utcnow() - start_time).total_seconds() * 1000)
            
            return {
                "success": True,
                "execution_time": execution_time,
                "screenshots": screenshots,
                "data": extracted_data,
                "actions_completed": len([a for a in actions if a.completed])
            }
            
        except Exception as e:
            logger.error(f"Task execution failed: {e}")
            return {
                "success": False,
                "error": str(e),
                "execution_time": int((datetime.utcnow() - start_time).total_seconds() * 1000)
            }
    
    async def _generate_actions_from_description(self, description: str, url: str) -> List[BrowserAction]:
        """Generate browser actions from task description (AI integration placeholder)"""
        # This is a placeholder - in production, this would use the AI service
        # to analyze the description and generate appropriate browser actions
        
        actions = []
        
        # Simple keyword-based action generation for demo
        if "search" in description.lower():
            actions.append(BrowserAction(
                type=ActionType.CLICK,
                selector="input[type='search'], input[name='q'], #search",
                description="Click on search input",
                order=1
            ))
            actions.append(BrowserAction(
                type=ActionType.TYPE,
                selector="input[type='search'], input[name='q'], #search",
                value="search query from description",
                description="Type search query",
                order=2
            ))
            actions.append(BrowserAction(
                type=ActionType.CLICK,
                selector="button[type='submit'], input[type='submit']",
                description="Submit search",
                order=3
            ))
        
        if "screenshot" in description.lower():
            actions.append(BrowserAction(
                type=ActionType.SCREENSHOT,
                description="Take screenshot",
                order=len(actions) + 1
            ))
        
        return actions
    
    async def _execute_action(self, action: BrowserAction):
        """Execute a single browser action"""
        if not self.page:
            raise Exception("Browser page not initialized")
        
        try:
            if action.type == ActionType.CLICK:
                await self.page.click(action.selector, timeout=5000)
                
            elif action.type == ActionType.TYPE:
                await self.page.fill(action.selector, action.value)
                
            elif action.type == ActionType.SCROLL:
                await self.page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                
            elif action.type == ActionType.WAIT:
                await self.page.wait_for_timeout(int(action.value) if action.value else 1000)
                
            elif action.type == ActionType.NAVIGATE:
                await self.page.goto(action.value)
                
            elif action.type == ActionType.SCREENSHOT:
                await self.page.screenshot()
                
            elif action.type == ActionType.EXTRACT:
                # Extract data based on selector
                elements = await self.page.query_selector_all(action.selector)
                extracted = []
                for element in elements:
                    text = await element.text_content()
                    extracted.append(text)
                return extracted
                
        except Exception as e:
            logger.error(f"Action execution failed: {e}")
            raise
    
    async def cleanup(self):
        """Cleanup browser resources"""
        try:
            if self.page:
                await self.page.close()
            if self.context:
                await self.context.close()
            if self.browser:
                await self.browser.close()
            if self.playwright:
                await self.playwright.stop()
                
            logger.info("Browser service cleaned up successfully")
            
        except Exception as e:
            logger.error(f"Error during browser cleanup: {e}")