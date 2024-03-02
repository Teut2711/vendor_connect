import uuid
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils.translation import gettext as _

from authentication.models import User

# Create your models here.


class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    addresses = ArrayField(base_field=models.CharField(max_length=500))
