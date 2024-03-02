import uuid
from django.db import models
from django.utils.translation import gettext as _
from django.contrib.gis.db import models as geo_models

from authentication.models import User
from customer.models import Customer
from django_choices_field import TextChoicesField


class Vendor(models.Model):
    class VendorTypeCategory(models.TextChoices):
        SERVICE = "S", "service"
        PRODUCT = "P", "product"

    class VendorMobilityCategory(models.TextChoices):
        MOBILE = "M", "mobile"
        STATIONARY = "S", "stationary"

    class VendorProfessionCategory(models.TextChoices):
        ICE_CREAM = "ice-cream", "Ice Cream"
        JUICE = "juice", "Juice"
        VEGETABLE = "vegetable", "Vegetable"
        FRUIT = "fruit", "Fruit"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="vendor")
    type_value = TextChoicesField(choices_enum=VendorTypeCategory)
    mobility = TextChoicesField(choices_enum=VendorMobilityCategory)
    address = models.TextField(null=True)
    location = geo_models.PointField(
        help_text="Longitude and Latitude as in WKT", null=True
    )
    profession = TextChoicesField(choices_enum=VendorProfessionCategory)


class ServiceBasedVendor(models.Model):
    vendor = models.OneToOneField(Vendor, on_delete=models.CASCADE)


class ProductBasedVendor(models.Model):
    vendor = models.OneToOneField(Vendor, on_delete=models.CASCADE)


class Order(models.Model):
    class OrderStatusChoices(models.TextChoices):
        PENDING = "pdg", "Pending"
        CONFIRMED = "cnf", "Confirmed"
        DELIVERED = "dld", "Delivered"
        CANCELLED = "cnl", "Cancelled"

    customer = models.ForeignKey(
        Customer, related_name="orders", on_delete=models.CASCADE
    )
    vendor = models.ForeignKey(Vendor, related_name="orders", on_delete=models.CASCADE)
    status = TextChoicesField(choices_enum=OrderStatusChoices)


class Price(models.Model):

    class CurrencyChoices(models.TextChoices):
        INR = "INR", "Indian Rupee"

    value = models.FloatField()
    currency = TextChoicesField(choices_enum=CurrencyChoices)


class Quantity(models.Model):

    class QuantityUnitsChoices(models.TextChoices):
        NONE = "NONE", "None"
        KG = "KG", "Kilograms"
        G = "G", "Grams"

    value = models.FloatField()
    units = TextChoicesField(choices_enum=QuantityUnitsChoices)


class Product(models.Model):
    name = models.CharField(max_length=20)
    photo = models.ImageField(upload_to="user_photos/", null=True)

    description = models.CharField(max_length=200)
    details = models.JSONField(default=dict)
    vendor = models.ForeignKey(
        ProductBasedVendor, related_name="products", on_delete=models.CASCADE
    )


class Service(models.Model):
    customer = models.ForeignKey(
        Customer, related_name="services", on_delete=models.CASCADE
    )
    vendor = models.ForeignKey(
        Vendor, related_name="services", on_delete=models.CASCADE
    )
