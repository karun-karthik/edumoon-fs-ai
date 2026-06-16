from fastapi import FastAPI
from .config import settings
from .routes import router
from .external_router import ex_router

fApp = FastAPI(
    title=settings.app_name,
    description=settings.app_description,
    version=settings.app_version
)
fApp.include_router(router)
fApp.include_router(ex_router)