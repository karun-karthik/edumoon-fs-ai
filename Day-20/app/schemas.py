from pydantic import BaseModel, constr, Field, field_validator
from typing import Optional


class ItemCreate(BaseModel):
    name: constr(min_length=1, max_length=100, strip_whitespace=True) = Field(
        ..., description="A name for item"
    )
    description: constr(min_length=1, max_length=500, strip_whitespace=True) = Field(
        ..., description="A detailed description of the item"
    )
    price: float = Field(
        ..., gt=0, description="Price of the item (must be greater than 0)"
    )


class ItemUpdate(BaseModel):
    name: Optional[constr(min_length=1, max_length=100, strip_whitespace=True)] = Field(
        None, description="A name for item"
    )
    description: Optional[constr(min_length=1, max_length=500, strip_whitespace=True)] = Field(
        None, description="A detailed description of the item"
    )
    price: Optional[float] = Field(
        None, gt=0, description="Price of the item (must be greater than 0)"
    )


class ItemResponse(ItemCreate):
    id: int
    name: str
    description: str
    price: float