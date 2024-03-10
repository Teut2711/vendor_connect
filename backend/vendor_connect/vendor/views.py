from typing import Any, Union
from django.http import HttpRequest, HttpResponseNotAllowed
from authentication.auth import GoogleOAuth2Authentication
from authentication.models import User
from vendor.schema import schema
from rest_framework.permissions import IsAuthenticated
from strawberry.django.views import AsyncGraphQLView
from knox.auth import TokenAuthentication
from rest_framework.views import APIView

from django.http.response import HttpResponse
from django.template.response import TemplateResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from strawberry.http.exceptions import HTTPException
from asgiref.sync import sync_to_async


class UserTypeValuePermission(IsAuthenticated):

    def has_permission(self, request, view):
        # Check if user is authenticated
        if not request.user or not request.user.is_authenticated:
            return False

        # Check if user's type_value is "V"
        if request.user.type_value == User.UserCategory.VENDOR:
            return True

        return False


class DjangoAsyncGraphQLView(AsyncGraphQLView, APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [UserTypeValuePermission]

    @property
    def allowed_methods(self):
        """
        Return the list of allowed HTTP methods, uppercased.
        """
        self.http_method_names.append("post")
        return [
            method.upper() for method in self.http_method_names if hasattr(self, method)
        ]

    @method_decorator(csrf_exempt)
    async def dispatch(  # pyright: ignore
        self, request: HttpRequest, *args: Any, **kwargs: Any
    ) -> Union[HttpResponseNotAllowed, TemplateResponse, HttpResponse]:
        self.args = args
        self.kwargs = kwargs
        request = self.initialize_request(request, *args, **kwargs)
        self.request = request
        self.headers = self.default_response_headers  # deprecate?

        try:
            await sync_to_async(self.initial)(request, *args, **kwargs)

            return await self.run(request=request)

        except HTTPException as e:
            return HttpResponse(
                content=e.reason,
                status=e.status_code,
            )
        except Exception as exc:
            print(exc)
            return HttpResponse(
                content=str(exc),
                status=500,
            )
