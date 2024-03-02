from typing import Optional, cast

import vendor.schemas.product as product_schema
import vendor.schemas.vendor as vendor_schema
from . import models as vendor_models

import strawberry
from strawberry.types import Info


@strawberry.type
class Mutation:

    @strawberry.mutation
    async def create_vendor(
        self,
        partialVendor: vendor_schema.VendorPartialInput,
        info: Info,
    ) -> vendor_schema.Vendor:
        vendor_instance = await vendor_models.ProductBasedVendor.objects.create(
            vendor=vendor_models.Vendor.objects.acreate(
                user=info.context.request.user,
                type_value=partialVendor.type_value,
                mobility=partialVendor.mobility,
                profession=partialVendor.profession,
            )
        )
        return cast(
            vendor_schema.Vendor,
            vendor_instance,
        )

    @strawberry.mutation
    async def create_product(
        self,
        partialProduct: product_schema.ProductPartialInput,
        info: Info,
    ) -> product_schema.Product:
        print(partialProduct.photo)
        vendor = await vendor_models.Vendor.objects.aget(user=info.context.request.user)
        product_based_vendor = await vendor_models.ProductBasedVendor.objects.aget(
            vendor=vendor
        )

        product_instance = await vendor_models.Product.objects.acreate(
            vendor=product_based_vendor,
            name=partialProduct.name,
            description=partialProduct.description,
            details={
                "cost": {
                    "price": strawberry.asdict(partialProduct.price),
                    "quantity": strawberry.asdict(partialProduct.quantity),
                }
            },
        )
        return cast(
            vendor_schema.Product,
            product_instance,
        )


@strawberry.type
class Query:
    @strawberry.field
    async def get_vendor_details(
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
