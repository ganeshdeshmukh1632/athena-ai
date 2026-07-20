from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Athena AI Backend"
    environment: str = "development"
    cors_origins: list[str] = ["*"]
    groq_api_key: str = ""
    database_url: str = ""
    jwt_secret_key: str = ""
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # 7 days

    class Config:
        env_file = ".env"


settings = Settings()
