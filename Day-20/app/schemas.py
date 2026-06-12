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

    # @field_validator("price")
    # @classmethod
    # def validate_price(cls, v):
    #     """Validate price has at most 2 decimal places."""
    #     if round(v, 2) != v:
    #         raise ValueError("Price must have at most 2 decimal places")
    #     return round(v, 2)


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

    # @field_validator("price")
    # @classmethod
    # def validate_price(cls, v):
    #     """Validate price has at most 2 decimal places."""
    #     if v is not None and round(v, 2) != v:
    #         raise ValueError("Price must have at most 2 decimal places")
    #     return round(v, 2) if v is not None else None


class ItemResponse(ItemCreate):
    id: int