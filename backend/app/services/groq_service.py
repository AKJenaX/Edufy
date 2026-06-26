import logging
from dataclasses import dataclass
from typing import Optional

import requests

from config import settings

logger = logging.getLogger(__name__)


@dataclass
class GroqResult:
    text: str
    model: str


class GroqService:
    def __init__(self):
        self.base_url = settings.GROQ_BASE_URL
        self.default_model = settings.GROQ_MODEL
        self.models = settings.groq_models_list

    def _model_candidates(self, requested_model: Optional[str] = None) -> list[str]:
        if requested_model:
            if requested_model not in self.models:
                raise ValueError(
                    f"Unsupported model '{requested_model}'. Available models: {', '.join(self.models)}"
                )
            return [requested_model]

        return [self.default_model] + [
            model for model in self.models if model != self.default_model
        ]

    def generate(
        self,
        prompt: str,
        system: Optional[str] = None,
        model: Optional[str] = None
    ) -> GroqResult:
        """Generate a response from Groq using the requested model or configured fallback order."""
        url = f"{self.base_url}/chat/completions"
        errors = []
        headers = {
            "Authorization": f"Bearer {settings.GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        for candidate_model in self._model_candidates(model):
            messages = []
            if system:
                messages.append({"role": "system", "content": system})
            messages.append({"role": "user", "content": prompt})

            payload = {
                "model": candidate_model,
                "messages": messages
            }

            try:
                response = requests.post(url, json=payload, headers=headers, timeout=60)
                response.raise_for_status()
                result = response.json()
                text = result["choices"][0]["message"]["content"]
                return GroqResult(
                    text=text,
                    model=candidate_model
                )
            except Exception as e:
                logger.error(f"Groq API error for model {candidate_model}: {e}")
                errors.append(f"{candidate_model}: {str(e)}")

        raise Exception(f"Failed to generate response: {'; '.join(errors)}")

    def summarize(self, content: str, model: Optional[str] = None) -> GroqResult:
        """Summarize educational content."""
        system = "You are an educational AI assistant. Provide clear, concise summaries suitable for students."

        prompt = f"""Summarize the following educational content in a clear, concise manner:

Content:
{content}

Provide a summary that captures the key points and main ideas."""

        return self.generate(prompt, system, model)

    def explain(
        self,
        concept: str,
        context: Optional[str] = None,
        model: Optional[str] = None
    ) -> GroqResult:
        """Explain a concept."""
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

        return self.generate(prompt, system, model)

    def generate_quiz(
        self,
        content: str,
        num_questions: int = 5,
        model: Optional[str] = None
    ) -> GroqResult:
        """Generate quiz questions from content."""
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

        return self.generate(prompt, system, model)

    def chat(
        self,
        message: str,
        context: Optional[str] = None,
        model: Optional[str] = None
    ) -> GroqResult:
        """Chat with AI assistant."""
        system = "You are a helpful educational AI assistant. Answer questions clearly and provide helpful explanations."

        if context:
            prompt = f"""Context:
{context}

Student Question: {message}

Provide a helpful, educational response."""
        else:
            prompt = message

        return self.generate(prompt, system, model)

    def available_models(self) -> dict:
        return {
            "default_model": self.default_model,
            "models": self.models
        }


groq_service = GroqService()
