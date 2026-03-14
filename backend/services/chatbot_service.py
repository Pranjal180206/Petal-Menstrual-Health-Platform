import os
from typing import List, Dict
import anthropic
from dotenv import load_dotenv

load_dotenv()

class ChatbotService:
    def __init__(self):
        self.client = anthropic.AsyncAnthropic(
            api_key=os.getenv("ANTHROPIC_API_KEY", "dummy_key")
        )
        self.system_prompt = (
            "You are a compassionate, knowledgeable, and culturally sensitive Menstrual Health Educator. "
            "Your goal is to provide accurate and supportive information regarding menstrual health, hygiene, "
            "and bodily changes. You speak in a friendly, approachable tone. You should adjust your responses "
            "based on the language preferred by the user. Do not provide medical diagnoses."
        )

    async def get_response(self, message: str, history: List[Dict[str, str]], language: str = "en") -> str:
        # Convert our history format into Anthropic's message format if needed
        # Expected history: [{"role": "user", "content": "hello"}, {"role": "assistant", "content": "hi"}]
        
        system = f"{self.system_prompt}\nThe user prefers to communicate in language code: {language}. Please reply in this language if possible."
        
        messages = []
        for msg in history:
            messages.append({
                "role": msg.get("role"),
                "content": msg.get("content")
            })
            
        messages.append({
            "role": "user",
            "content": message
        })
        
        try:
            response = await self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1000,
                system=system,
                messages=messages
            )
            return response.content[0].text
        except Exception as e:
            print(f"Anthropic error: {e}")
            return "I'm currently unable to connect to my knowledge base. Please try again later."

chatbot_service = ChatbotService()
