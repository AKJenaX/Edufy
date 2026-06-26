from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List


class Settings(BaseSettings):
    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "edify"
    
    # JWT
    JWT_SECRET: str = "Edufy-secret-key-2024"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Groq
    GROQ_API_KEY: str
    GROQ_BASE_URL: str = "https://api.groq.com/openai/v1"
    GROQ_MODEL: str = "openai/gpt-oss-20b"
    GROQ_MODELS: str = "openai/gpt-oss-20b,openai/gpt-oss-120b"
    
    # Application
    APP_NAME: str = "Edufy Smart Campus"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000"

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug(cls, value):
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"release", "prod", "production", "false", "0", "no"}:
                return False
            if normalized in {"debug", "dev", "development", "true", "1", "yes"}:
                return True
        return value
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    @property
    def groq_models_list(self) -> List[str]:
        models = [model.strip() for model in self.GROQ_MODELS.split(",") if model.strip()]
        if self.GROQ_MODEL not in models:
            models.insert(0, self.GROQ_MODEL)
        return models
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": True
    }


settings = Settings()

# Made with Bob
