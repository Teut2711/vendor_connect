from django.db import models
from django.utils.translation import gettext as _
from django.contrib.gis.db import models as geo_models

from authentication.models import User

# Create your models here.


class Vendor(models.Model):
    class VendorType(models.TextChoices):
        SERVICE = "S", "service"
        PRODUCT = "P", "product"

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    type_value = models.CharField(max_length=5, choices=VendorType.choices)
    address = models.CharField(max_length=500)
    location = geo_models.PointField(help_text="Longitude and Latitude as in WKT")


class ServiceBasedVendor(models.Model):
    user = models.OneToOneField(Vendor, on_delete=models.CASCADE)


class ProductBasedVendor(models.Model):
    user = models.OneToOneField(Vendor, on_delete=models.CASCADE)
