from fastapi import APIRouter, Query
from .service import fetch_data
from .config import settings

ex_router = APIRouter(prefix="/external", tags = ["external api"])

@ex_router.get("/", summary="This invokes an external API")
async def list_items(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of items to return"),
):
    data = await fetch_data(settings.external_url)
    return data[skip: skip + limit]