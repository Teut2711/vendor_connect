from django.contrib import admin
from django.urls import include, path

from authentication.views import LoginView
from django.views.decorators.csrf import csrf_exempt
from vendor.schema import schema as vendor_schema
from vendor.views import DjangoAsyncGraphQLView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", LoginView.as_view(), name="knox_login"),
    path(
        "api/graphql/vendor",
        csrf_exempt(
            DjangoAsyncGraphQLView.as_view(
                schema=vendor_schema,
                graphql_ide="apollo-sandbox",
            )
        ),
    ),  # Include the URL configuration of the vendor app
]
