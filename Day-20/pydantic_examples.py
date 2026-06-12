from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    email: str

user = User(id="1", name="John", email="test@mail.com")
print(user)

assert user.id == 1 # pydantic converts all the string inputs to corresponding data types

################################################

from typing import Optional

class Product(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = 0.0

product = Product(name="DSA Prep")
print(product)

assert product.description is None


################################################

from pydantic import Field, PositiveInt, constr

class Order(BaseModel):
    quantity: PositiveInt
    orderId: constr(min_length=3, strip_whitespace=True) = Field(..., alias="product_orderId")

order = Order(quantity='5', product_orderId="  t  ")

assert order.orderId == "t"