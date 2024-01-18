# serializers.py

from rest_framework import serializers
from .models import (
    User,
    Vendor,
    ServiceBasedVendor,
    ProductBasedVendor,
    Customer,
    Order,
    Product,
    Service,
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = "__all__"


class ServiceBasedVendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceBasedVendor
        fields = "__all__"


class ProductBasedVendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductBasedVendor
        fields = "__all__"


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"
