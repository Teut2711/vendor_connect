from django.db import models
from django.contrib.auth.models import AbstractUser
from django.forms import ValidationError
from django.contrib.postgres.fields import ArrayField, JSONField
from django.utils.translation import gettext as _
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.gis.db import models as geo_models
from django.core.validators import EmailValidator
from phonenumber_field.modelfields import PhoneNumberField

import uuid


class User(AbstractUser):
    class UserType(models.TextChoices):
        VENDOR = "V", "vendor"
        CUSTOMER = "C", "customer"

    username = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone_number = PhoneNumberField(region="IN", null=True, unique=True)
    otp = models.PositiveIntegerField(
        null=True,
        validators=[MinValueValidator(100000), MaxValueValidator(999999)],
        help_text="6 digit otp.",
    )
    photo = models.ImageField(upload_to="user_photos/", null=True)
    type_value = models.CharField(max_length=10, choices=UserType.choices, null=False)
    rating = models.PositiveIntegerField(
        default=None,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Enter a rating between 1 and 5.",
        null=True,
    )
    email = models.EmailField(
        validators=[EmailValidator(message="Enter a valid email address.")],
        unique=True,
        null=False,
    )
    verified = models.BooleanField(default=False)

    def __str__(self):
        return _(f"{self.first_name} {self.last_name}")
