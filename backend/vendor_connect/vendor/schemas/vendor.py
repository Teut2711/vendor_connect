from vendor import models
from strawberry import auto
import strawberry_django
import authentication.schema as user_schema


@strawberry_django.type(models.Vendor)
class Vendor:
    user: "user_schema.User"
    type_value: auto
    mobility: auto
    profession: auto
    location: auto
    address: auto


@strawberry_django.input(models.Vendor, partial=True)
class VendorPartialInput:
    type_value: auto
    mobility: auto
    profession: auto


@strawberry_django.type(models.ProductBasedVendor)
class ProductBasedVendor:
    vendor: auto
