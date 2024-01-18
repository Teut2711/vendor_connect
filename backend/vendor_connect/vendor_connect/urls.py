from django.contrib import admin
from django.urls import path

from authentication.views import LoginView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", LoginView.as_view(), name="knox_login"),
]
