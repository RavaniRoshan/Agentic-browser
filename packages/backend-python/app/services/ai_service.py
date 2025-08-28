"""
AI service for task understanding and action generation using Hugging Face
"""

from typing import List, Dict, Any, Optional
import logging
from huggingface_hub import InferenceClient
import json

from app.core.config import settings
from app.models.task import BrowserAction, ActionType

logger = logging.getLogger(__name__)

class AIService:
    """AI service for browser automation intelligence"""
    
    def __init__(self):
        self.client = None
        if settings.HUGGINGFACE_API_TOKEN:
            self.client = InferenceClient(token=settings.HUGGINGFACE_API_TOKEN)
        else:
            logger.warning("Hugging Face API token not provided. AI features will be limited.")
    
    async def analyze_task_description(self, description: str, url: str) -> Dict[str, Any]:
        """Analyze task description and generate execution plan"""
        try:
            if not self.client:
                return self._fallback_analysis(description, url)
            
            prompt = f"""
            Analyze this browser automation task:
            
            Task: {description}
            Target URL: {url}
            
            Generate a JSON response with:
            1. task_type: The type of automation (search, form_fill, data_extract, etc.)
            2. complexity: Low, Medium, or High
            3. estimated_time: Estimated execution time in seconds
            4. required_actions: List of browser actions needed
            5. success_criteria: How to determine if the task succeeded
            
            Response format:
            {{
                "task_type": "search",
                "complexity": "Medium",
                "estimated_time": 30,
                "required_actions": ["navigate", "click", "type", "submit"],
                "success_criteria": "Search results are displayed"
            }}
            """
            
            # Use text generation for analysis
            response = await self._generate_text(prompt)
            
            try:
                analysis = json.loads(response)
                return analysis
            except json.JSONDecodeError:
                logger.warning("Failed to parse AI response as JSON, using fallback")
                return self._fallback_analysis(description, url)
                
        except Exception as e:
            logger.error(f"AI analysis failed: {e}")
            return self._fallback_analysis(description, url)
    
    async def generate_browser_actions(self, description: str, url: str) -> List[BrowserAction]:
        """Generate specific browser actions from task description"""
        try:
            analysis = await self.analyze_task_description(description, url)
            actions = []
            
            # Convert analysis to browser actions
            action_types = analysis.get("required_actions", [])
            
            for i, action_type in enumerate(action_types):
                if action_type == "navigate":
                    actions.append(BrowserAction(
                        type=ActionType.NAVIGATE,
                        value=url,
                        description=f"Navigate to {url}",
                        order=i
                    ))
                elif action_type == "click":
                    actions.append(BrowserAction(
                        type=ActionType.CLICK,
                        selector="button, a, input[type='submit']",
                        description="Click on interactive element",
                        order=i
                    ))
                elif action_type == "type":
                    actions.append(BrowserAction(
                        type=ActionType.TYPE,
                        selector="input, textarea",
                        value="Generated input text",
                        description="Type in input field",
                        order=i
                    ))
                elif action_type == "screenshot":
                    actions.append(BrowserAction(
                        type=ActionType.SCREENSHOT,
                        description="Take screenshot",
                        order=i
                    ))
            
            return actions
            
        except Exception as e:
            logger.error(f"Action generation failed: {e}")
            return self._fallback_actions(description)
    
    async def _generate_text(self, prompt: str) -> str:
        """Generate text using Hugging Face model"""
        try:
            response = self.client.text_generation(
                prompt,
                model=settings.HUGGINGFACE_MODEL,
                max_new_tokens=500,
                temperature=0.7,
                do_sample=True
            )
            return response
            
        except Exception as e:
            logger.error(f"Text generation failed: {e}")
            return ""
    
    def _fallback_analysis(self, description: str, url: str) -> Dict[str, Any]:
        """Fallback analysis when AI is not available"""
        task_type = "general"
        complexity = "Medium"
        
        if any(word in description.lower() for word in ["search", "find", "look"]):
            task_type = "search"
        elif any(word in description.lower() for word in ["form", "fill", "submit"]):
            task_type = "form_fill"
        elif any(word in description.lower() for word in ["extract", "scrape", "collect"]):
            task_type = "data_extract"
        
        return {
            "task_type": task_type,
            "complexity": complexity,
            "estimated_time": 30,
            "required_actions": ["navigate", "screenshot"],
            "success_criteria": "Task completed without errors"
        }
    
    def _fallback_actions(self, description: str) -> List[BrowserAction]:
        """Fallback action generation"""
        actions = [
            BrowserAction(
                type=ActionType.SCREENSHOT,
                description="Take initial screenshot",
                order=0
            )
        ]
        
        if "search" in description.lower():
            actions.extend([
                BrowserAction(
                    type=ActionType.CLICK,
                    selector="input[type='search'], #search, [name='q']",
                    description="Click search input",
                    order=1
                ),
                BrowserAction(
                    type=ActionType.TYPE,
                    selector="input[type='search'], #search, [name='q']",
                    value="search query",
                    description="Enter search query",
                    order=2
                )
            ])
        
        return actions