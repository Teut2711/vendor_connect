from django.utils.translation import gettext as _
from authentication.auth import GoogleOAuth2Authentication
from knox.views import LoginView as KnoxLoginView


class LoginView(KnoxLoginView):
    authentication_classes = [GoogleOAuth2Authentication]

    def get_post_response_data(self, request, token, instance):
        data = super().get_post_response_data(request, token, instance)
        data["verified"] = self.request.auth
        return data


# class UserInfoView(APIView):
#     authentication_classes = [GoogleOAuth2Authentication]

#     def post(self, request, *args, **kwargs):
#         user = self.request.auth[0]
#         drf_token = self.request.auth[1]

#         # Serialize user data if needed
#         user_data = YourUserSerializer(user).data

#         # Include the token in the response
#         response_data = {
#             "token": drf_token.key,
#             "user": user_data,
#         }

#         return Response(response_data)


# def generate_digit_otp(num_digits):
#     otp = int.from_bytes(os.urandom(2), byteorder="big") % (10**num_digits)
#     return f"{otp:0{num_digits}d}"


# class OTPVerificationViewSet(ModelViewSet):
#     @action(detail=False, methods=["post"])
#     def send_otp(self, request):
#         # phone_number = request.data.get("phone_number")
#         # by = request.data.get("phone_number")
#         header_token = request.META.get("Authorization", None)

#         otp = generate_digit_otp(num_digits=6)

#         user, created = User.objects.get_or_create(username=phone_number)
#         if created:
#             user.otp = otp
#         user.save()

#         twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
#         message = twilio_client.messages.create(
#             body=f"Your OTP is: {otp}", from_=TWILIO_PHONE_NUMBER, to=phone_number
#         )

#         if message.sid:
#             return Response(
#                 {"detail": _("OTP sent successfully"), "user_id": user.id},
#                 status=status.HTTP_200_OK,
#             )
#         else:
#             return Response(
#                 {"error": _("Failed to send OTP")},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             )

#     @action(detail=False, methods=["post"])
#     def verify_otp_and_register(self, request):
#         phone_number = request.data.get("phone_number")
#         otp = request.data.get("otp")

#         try:
#             user = User.objects.get(username=phone_number)
#         except User.DoesNotExist:
#             return Response(
#                 {"error": _("Invalid phone number")},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         # Validate OTP
#         if user.otp == otp:
#             # Mark the user as verified
#             user.verified = True
#             user.save()

#             # Generate an OAuth2 token and return it in the response
#             token, created = Token.objects.get_or_create(user=user)

#             return Response(
#                 {
#                     "detail": _("OTP verification and registration successful"),
#                     "auth_token": token.key,
#                 },
#                 status=status.HTTP_200_OK,
#             )
#         else:
#             return Response(
#                 {"error": _("Invalid OTP")},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
