from fastapi import APIRouter, HTTPException, Query
from typing import List
from .schemas import ItemCreate, ItemUpdate, ItemResponse
from .service import ItemRepository

router = APIRouter(prefix="/api", tags=["items apis"])

# Initialize the repository
item_repo = ItemRepository()


@router.get("/", summary="API health check")
def root() -> dict[str, str]:
    return {"message": "FastAPI Crud is running", "version": "0.0.1"}


@router.get("/items", response_model=List[ItemResponse], summary="Listing all the items with pagination")
def list_items(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of items to return"),
) -> List[ItemResponse]:

    """
    Get a paginated list of all items.
    
    - **skip**: Number of items to skip (default: 0)
    - **limit**: Number of items to return (default: 10, max: 100)
    """
    all_items = item_repo.list_items()
    return all_items[skip : skip + limit]


@router.get("/items/{item_id}", response_model=ItemResponse, summary="Get a specific item by ID")
def get_item(item_id: int) -> ItemResponse:
    """Get a specific item by its ID."""
    item = item_repo.get_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Item with id {item_id} not found")
    return item


@router.post("/items", response_model=ItemResponse, status_code=201, summary="Create a new item")
def create_item(item_create: ItemCreate) -> ItemResponse:
    """
    Create a new item.
    
    Required fields:
    - **name**: Item name (1-100 characters)
    - **description**: Item description (1-500 characters)
    - **price**: Item price (must be > 0, max 2 decimal places)
    """
    new_item = item_repo.create_item(
        name=item_create.name,
        description=item_create.description,
        price=item_create.price,
    )
    return new_item


@router.put("/items/{item_id}", response_model=ItemResponse, summary="Update an item by ID")
def update_item(item_id: int, item_update: ItemUpdate) -> ItemResponse:
    """
    Update an existing item.
    
    All fields are optional. Only provided fields will be updated.
    """
    item = item_repo.get_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Item with id {item_id} not found")
    
    # Update only provided fields
    update_data = item_update.model_dump(exclude_unset=True)
    updated_item = item_repo.update_item(item_id, **update_data)
    
    return updated_item


@router.delete("/items/{item_id}", status_code=204, summary="Delete an item by ID")
def delete_item(item_id: int):
    """Delete an item by its ID."""
    if not item_repo.delete_item(item_id):
        raise HTTPException(status_code=404, detail=f"Item with id {item_id} not found")