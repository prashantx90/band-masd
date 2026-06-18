import os
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    DIRECTUS_URL: str = Field(
        default_factory=lambda: os.getenv("NEXT_PUBLIC_DIRECTUS_URL", "http://localhost:8055")
    )
    DIRECTUS_TOKEN: str = Field(
        default_factory=lambda: os.getenv("DIRECTUS_API_TOKEN", "")
    )
    OLLAMA_URL: str = Field(
        default_factory=lambda: os.getenv("LLM_BASE_URL", "http://localhost:11434/v1")
    )
    OLLAMA_MODEL: str = Field(
        default_factory=lambda: os.getenv("LLM_MODEL", "qwen3:8b")
    )
    PREFECT_URL: str = Field(
        default_factory=lambda: os.getenv("PREFECT_API_URL", "http://127.0.0.1:4200/api")
    )
    BAND_URL: str = Field(
        default_factory=lambda: os.getenv("BAND_URL", "http://localhost:8055")
    )

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
