from app.core.config import settings
from openai import AsyncOpenAI

class AIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    async def generate_report(self, commits: list):
        # TODO: Implement OpenAI structured output call
        pass
