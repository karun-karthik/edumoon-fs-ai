from typing import List, Optional
from pydantic import BaseModel


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
            Item(id=1, name="Python Book", description="Comprehensive guide to Python programming", price=29.99),
            Item(id=2, name="JavaScript Guide", description="Modern JavaScript best practices and patterns", price=24.99),
            Item(id=3, name="FastAPI Tutorial", description="Complete FastAPI framework tutorial with examples", price=34.99),
            Item(id=4, name="Web Development Course", description="Full-stack web development from basics to advanced", price=49.99),
            Item(id=5, name="Database Design", description="Database design patterns and optimization techniques", price=39.99),
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
            description: The description of the new item
            price: The price of the new item
            
        Returns:
            The newly created item
        """
        new_item = Item(id=self._next_id, name=name, description=description, price=price)
        self.items.append(new_item)
        self._next_id += 1
        return new_item
    
    def update_item(self, item_id: int, **kwargs) -> Optional[Item]:
        """
        Update an existing item.
        
        Args:
            item_id: The ID of the item to update
            **kwargs: Fields to update (name, description, price)
            
        Returns:
            The updated item if found, None otherwise
        """
        item = self.get_item(item_id)
        if item:
            for key, value in kwargs.items():
                if value is not None and hasattr(item, key):
                    setattr(item, key, value)
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
