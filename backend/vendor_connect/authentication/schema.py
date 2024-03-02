import strawberry_django
from strawberry import auto
from authentication import models


@strawberry_django.type(models.User)
class User:
    first_name: auto
    last_name: auto
    username: auto
    phone_number: str
    otp: auto
    photo: auto
    type_value: auto
    rating: auto
    email: auto
    verified: auto
