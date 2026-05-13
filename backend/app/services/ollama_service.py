import requests
from typing import Optional, Dict, Any
from config import settings
import logging

logger = logging.getLogger(__name__)


class OllamaService:
    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL
        self.model = settings.OLLAMA_MODEL
    
    def generate(self, prompt: str, system: Optional[str] = None) -> str:
        """Generate response from Ollama"""
        try:
            url = f"{self.base_url}/api/generate"
            
            payload = {
                "model": self.model,
                "prompt": prompt,
                "stream": False
            }
            
            if system:
                payload["system"] = system
            
            response = requests.post(url, json=payload, timeout=60)
            response.raise_for_status()
            
            result = response.json()
            return result.get("response", "")
        
        except requests.exceptions.RequestException as e:
            logger.error(f"Ollama API error: {e}")
            raise Exception(f"Failed to generate response: {str(e)}")
    
    def summarize(self, content: str) -> str:
        """Summarize educational content"""
        system = "You are an educational AI assistant. Provide clear, concise summaries suitable for students."
        
        prompt = f"""Summarize the following educational content in a clear, concise manner:

Content:
{content}

Provide a summary that captures the key points and main ideas."""
        
        return self.generate(prompt, system)
    
    def explain(self, concept: str, context: Optional[str] = None) -> str:
        """Explain a concept"""
        system = "You are an educational AI assistant. Explain concepts in simple, easy-to-understand terms with examples."
        
        if context:
            prompt = f"""Explain the following concept in simple terms:

Concept: {concept}

Context:
{context}

Provide a clear explanation with examples if applicable."""
        else:
            prompt = f"""Explain the following concept in simple terms with examples:

Concept: {concept}"""
        
        return self.generate(prompt, system)
    
    def generate_quiz(self, content: str, num_questions: int = 5) -> str:
        """Generate quiz questions from content"""
        system = "You are an educational AI assistant. Generate multiple-choice questions to test understanding."
        
        prompt = f"""Generate {num_questions} multiple-choice questions from this content:

Content:
{content}

Format each question as:
Q: [question]
A) [option]
B) [option]
C) [option]
D) [option]
Correct: [A/B/C/D]

Separate each question with a blank line."""
        
        return self.generate(prompt, system)
    
    def chat(self, message: str, context: Optional[str] = None) -> str:
        """Chat with AI assistant"""
        system = "You are a helpful educational AI assistant. Answer questions clearly and provide helpful explanations."
        
        if context:
            prompt = f"""Context:
{context}

Student Question: {message}

Provide a helpful, educational response."""
        else:
            prompt = message
        
        return self.generate(prompt, system)


# Singleton instance
ollama_service = OllamaService()

# Made with Bob
