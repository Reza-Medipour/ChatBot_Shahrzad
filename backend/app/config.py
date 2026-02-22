from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080

    ALLOWED_ORIGINS: str = "*"

    LLM_API_URL: str = ""
    LLM_API_KEY: str = ""

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()
