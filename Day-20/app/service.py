from typing import List, Optional
from pydantic import BaseModel, constr, Field
import httpx

class Item(BaseModel):
    id: int
    name: str
    description: str
    price: float


class ItemRepository:
    """Repository for managing items with CRUD operations."""
    
    def __init__(self):
        """Initialize repository with default items."""
        self.items: List[Item] = [
            Item(id=1, name="Python Book", description="Python Cookbook", price=20.00),
            Item(id=2, name="JavaScript Guide",  description="JS Cookbook", price=10.00),
            Item(id=3, name="FastAPI Tutorial",  description="FastAPI Cookbook", price=40.00),
            Item(id=4, name="Web Development Course",  description="WebDev Cookbook", price=30.00),
            Item(id=5, name="Database Design",  description="DB Cookbook", price=50.00),
        ]
        self._next_id = 6  # Track the next ID for new items
    
    def list_items(self) -> List[Item]:
        """
        List all items in the repository.
        
        Returns:
            List of all items
        """
        return self.items
    
    def get_item(self, item_id: int) -> Optional[Item]:
        """
        Get a specific item by ID.
        
        Args:
            item_id: The ID of the item to retrieve
            
        Returns:
            The item if found, None otherwise
        """
        for item in self.items:
            if item.id == item_id:
                return item
        return None
    
    def create_item(self, name: str, description: str, price: float) -> Item:
        """
        Create a new item.
        
        Args:
            name: The name of the new item
            
        Returns:
            The newly created item
        """
        new_item = Item(id=self._next_id, name=name, description=description, price=price)
        self.items.append(new_item)
        self._next_id += 1
        return new_item
    
    def update_item(self, item_id: int, name: str, description: str, price: float) -> Optional[Item]:
        """
        Update an existing item.
        
        Args:
            item_id: The ID of the item to update
            name: The new name for the item
            
        Returns:
            The updated item if found, None otherwise
        """
        item = self.get_item(item_id)
        if item:
            item.name = name
            item.description = description
            item.price = price
            return item
        return None
    
    def delete_item(self, item_id: int) -> bool:
        """
        Delete an item by ID.
        
        Args:
            item_id: The ID of the item to delete
            
        Returns:
            True if item was deleted, False if item was not found
        """
        for i, item in enumerate(self.items):
            if item.id == item_id:
                self.items.pop(i)
                return True
        return False


async def fetch_data(url):
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()   