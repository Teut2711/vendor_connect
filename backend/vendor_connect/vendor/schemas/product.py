from enum import Enum
from vendor import models
from strawberry import auto
import strawberry_django
import vendor.schemas.vendor as vendor_schema
import strawberry


@strawberry.enum
class Currency(Enum):
    INR = "INR"
    USD = "USD"


@strawberry.type
class Price:
    value: float
    currency: "Currency"


@strawberry.type
class Quantity:
    value: float
    units: str


@strawberry_django.type(models.Product)
class Product:
    id: auto
    name: auto
    description: auto
    photo: auto
    price: "Price"
    quantity: "Quantity"
    vendor: "vendor_schema.ProductBasedVendor"


@strawberry_django.input(models.Price)
class PriceInput:
    value: auto
    currency: auto


@strawberry_django.input(models.Quantity)
class QuantityInput:
    value: auto
    units: auto


@strawberry_django.input(models.Product, partial=True)
class ProductPartialInput:
    id: auto
    name: auto
    description: auto
    price: "PriceInput"
    quantity: "QuantityInput"
    photo: str
