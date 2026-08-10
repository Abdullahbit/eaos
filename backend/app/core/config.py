import os

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = Field(
        default="postgresql://postgres:postgres@localhost:5432/eaos"
    )

    # Portal
    PORTAL_BASE_URL: str = Field(default="https://portal.studyfans.com")
    PORTAL_COOKIE_CONNECT_SID: str = Field(default="")

    # Sync Configuration
    SYNC_PAGE_SIZE: int = Field(default=100)

    # Logging
    LOG_LEVEL: str = Field(default="INFO")

    # Launch Readiness & Beta Instrumentation
    CORS_ORIGINS: str = Field(default="http://localhost:3000,http://127.0.0.1:3000")
    TELEGRAM_BOT_TOKEN: str = Field(default="")
    TELEGRAM_CHAT_ID: str = Field(default="")
    TURNSTILE_SECRET_KEY: str = Field(default="")
    ADMIN_TOKEN: str = Field(default="dev_admin_token")

    model_config = SettingsConfigDict(
        env_file=os.environ.get("ENV_FILE_PATH", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
