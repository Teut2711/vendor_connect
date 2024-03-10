from typing import Optional, Union, cast

import vendor.schemas.product as product_schema
import vendor.schemas.vendor as vendor_schema
from . import models as vendor_models

import strawberry
from strawberry.types import Info


@strawberry.type
class Mutation:

    @strawberry.mutation
    async def vendor(
        self,
        partialVendor: vendor_schema.VendorPartialInput,
        info: Info,
    ) -> vendor_schema.ProductBasedVendor:
        vendor_instance = await vendor_models.Vendor.objects.acreate(
            user=info.context.request.user,
            type_value=partialVendor.type_value,
            mobility=partialVendor.mobility,
            profession=partialVendor.profession,
        )
        if partialVendor.type_value == vendor_models.Vendor.VendorTypeCategory.PRODUCT:

            typed_vendor = await vendor_models.ProductBasedVendor.objects.acreate(
                vendor=vendor_instance
            )
            print(
                cast(
                    vendor_schema.ProductBasedVendor,
                    typed_vendor,
                )
            )
            return cast(
                vendor_schema.ProductBasedVendor,
                typed_vendor,
            )
        elif (
            partialVendor.type_value == vendor_models.Vendor.VendorTypeCategory.SERVICE
        ):

            typed_vendor = await vendor_models.ServiceBasedVendor.objects.acreate(
                vendor=vendor_instance
            )
            return cast(
                vendor_schema.ServiceBasedVendor,
                typed_vendor,
            )
        else:
            raise ValueError("Unknown vendor type")

    @strawberry.mutation
    async def product(
        self,
        partialProduct: product_schema.ProductPartialInput,
        info: Info,
    ) -> product_schema.Product:
        vendor = await vendor_models.Vendor.objects.aget(user=info.context.request.user)
        product_based_vendor = await vendor_models.ProductBasedVendor.objects.aget(
            vendor=vendor
        )

        product_instance = await vendor_models.Product.objects.acreate(
            vendor=product_based_vendor,
            name=partialProduct.name,
            description=partialProduct.description,
            photo=partialProduct.photo,
            details={
                "cost": {
                    "price": strawberry.asdict(partialProduct.price),
                    "quantity": strawberry.asdict(partialProduct.quantity),
                }
            },
        )
        return cast(product_schema.Product, product_instance)


@strawberry.type
class Query:
    @strawberry.field
    async def vendor(
        self,
        info: Info,
    ) -> Optional[vendor_schema.Vendor]:
        try:

            vendor_instance = await vendor_models.Vendor.objects.aget(
                user=info.context.request.user,
            )
            return cast(
                vendor_schema.Vendor,
                vendor_instance,
            )
        except vendor_models.Vendor.DoesNotExist:
            return None


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
)
