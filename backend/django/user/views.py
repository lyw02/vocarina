import os

import bcrypt
import requests

from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from dotenv import load_dotenv

# from rest_framework_jwt.serializers import jwt_payload_handler, jwt_encode_handler
from .utils.rest_framework_jwt_serializers import jwt_payload_handler, jwt_encode_handler

from .models import User
from .serializers import UserSerializer

load_dotenv()

RECAPTCHA_KEY = os.environ.get('RECAPTCHA_KEY')


class UserAuthView(APIView):

    def post(self, request):

        if request.query_params.get("action") == "register":
            """Create user"""
            username = request.data.get("username")
            password = request.data.get("password")

            if not username or not password:
                return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

            recaptcha_response = request.data.get("recaptcha")
            data = {
                "secret": RECAPTCHA_KEY,
                "response": recaptcha_response
            }
            r = requests.post("https://www.google.com/recaptcha/api/siteverify", data=data)
            result = r.json()
            if not result["success"]:
                return Response({"error": "Invalid reCAPTCHA"}, status=status.HTTP_400_BAD_REQUEST)

            hashed_password = make_password(password)
            try:
                user = User.objects.create(username=username, password_hash=hashed_password)
                user.save()
                return Response({"username": username, "message": "User created successfully"}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        elif request.query_params.get("action") == "login":
            """User login"""
            username = request.data.get("username")
            password = request.data.get("password")

            if not username or not password:
                return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                user = User.objects.get(username=username)
                if check_password(password, user.password_hash):
                    payload = jwt_payload_handler(user)
                    token = jwt_encode_handler(payload)
                    return Response({"token": token, "username": username, "id": user.id, "message": "Login successful"}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class UserView(GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "id"

    def get(self, request, id=None):

        if id is not None:
            """Get a single user"""
            serializer = self.get_serializer(instance=self.get_object())
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            """Get all users"""
            serializer = self.get_serializer(instance=self.get_queryset(), many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        """Update user"""
        serializer = self.get_serializer(instance=self.get_object(), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
