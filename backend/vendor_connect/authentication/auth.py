from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from authentication.models import User
from google.oauth2 import id_token

from google.auth.transport import requests

from rest_framework.exceptions import AuthenticationFailed


class GoogleOAuth2Authentication(BaseAuthentication):
    def authenticate(self, request):
        data = request.data
        id_token_str = data.get("idToken")
        client_id = data.get("clientId")
        user_type = data.get("userType")

        if not id_token_str or not client_id:
            return None

        try:
            idinfo = id_token.verify_oauth2_token(
                id_token_str,
                requests.Request(),
                client_id,
            )
            if not idinfo["email_verified"]:
                raise AuthenticationFailed("Your Google account is not verified")
            email = idinfo["email"]
            picture = idinfo["picture"]
            name = idinfo["name"]

            user, created = get_user_model().objects.get_or_create(email=email)
            if created:
                user.first_name = name
                user.photo = picture
                user.type_value = user_type
                if user_type == "customer":
                    user.verified = True
                user.save()
                user, _ = get_user_model().objects.get_or_create(email=email)

        except ValueError as e:
            raise AuthenticationFailed(f"Invalid Google access token :{e}")
        except Exception as e:
            raise AuthenticationFailed(f"Failed to authenticate with Google :{e}")

        return user, user.verified
