from pydantic import HttpUrl
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "CRUD Example"
    app_description: str = (
        "A simple fast api project for demo"
    )
    app_version: str = "0.1.0"
    external_url: str = "https://bored-api.appbrewery.com/filter?type=education"

    class Config:
        env_file = ".env"

settings = Settings()