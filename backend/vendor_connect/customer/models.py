import uuid
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils.translation import gettext as _

from authentication.models import User
from vendor.models import Vendor

# Create your models here.


class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    addresses = ArrayField(base_field=models.CharField(max_length=500))


class Order(models.Model):
    class OrderStatusType(models.TextChoices):
        PENDING = "pdg", "Pending"
        CONFIRMED = "cnf", "Confirmed"
        DELIVERED = "dld", "Delivered"
        CANCELLED = "cnl", "Cancelled"

    id_value = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(
        Customer, related_name="orders", on_delete=models.CASCADE
    )
    vendor = models.ForeignKey(Vendor, related_name="orders", on_delete=models.CASCADE)
    status = models.CharField(max_length=5, choices=OrderStatusType.choices)


class Product(models.Model):
    id_value = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=20)
    vendor_type = models.CharField(max_length=20)


class Service(models.Model):
    id_value = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(
        Customer, related_name="services", on_delete=models.CASCADE
    )
    vendor = models.ForeignKey(
        Vendor, related_name="services", on_delete=models.CASCADE
    )
