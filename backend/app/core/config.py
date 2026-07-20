from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Athena AI Backend"
    environment: str = "development"
    cors_origins: list[str] = ["*"]
    groq_api_key: str = ""
    database_url: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
