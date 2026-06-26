from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Application
    PROJECT_NAME: str = "GitLog API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    # Database (Supabase)
    DATABASE_URL: str
    SUPABASE_URL: str
    SUPABASE_KEY: str

    # GitHub OAuth
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str

    # Security
    SECRET_KEY: str = "supersecretkey"  # Change this in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 1 week

    # AI (OpenAI)
    OPENAI_API_KEY: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
