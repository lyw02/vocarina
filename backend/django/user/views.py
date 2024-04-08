import bcrypt

from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

# from rest_framework_jwt.serializers import jwt_payload_handler, jwt_encode_handler
from .utils.rest_framework_jwt_serializers import jwt_payload_handler, jwt_encode_handler

from .models import User
from .serializer import UserSerializer


# Create your views here.


@csrf_exempt
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_api(request, user_id=None):

    if user_id is not None and request.method == 'GET':
        '''Get user by id'''
        user = User.objects.get(id=user_id)
        user_serializer = UserSerializer(user)
        return JsonResponse(user_serializer.data, safe=False, status=201)

    elif request.method == 'GET':
        '''Get all users'''  # TODO admin
        users = User.objects.all()
        users_serializer = UserSerializer(users, many=True)
        return JsonResponse(users_serializer.data, safe=False, status=201)

    elif request.method == 'PUT':
        '''Update user'''
        new_user = JSONParser().parse(request)
        old_user = User.objects.get(id=new_user['id'])
        user_serializer = UserSerializer(old_user, data=new_user)
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse(f"User {new_user['id']} updated.", safe=False, status=201)
        return JsonResponse(f"Failed to update user {new_user['id']}.", safe=False, status=400)

    # elif user_id is not None and request.method == 'DELETE':
    #     '''Delete user'''
    #     user = User.objects.get(id=user_id)
    #     user.delete()
    #     return JsonResponse(f"User {user_id} deleted.", safe=False, status=201)


class UserAuthView(APIView):

    def post(self, request):

        if request.query_params.get("action") == "register":
            """Create user"""
            username = request.data.get("username")
            password = request.data.get("password")

            if not username or not password:
                return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

            hashed_password = make_password(password)
            try:
                user = User.objects.create(username=username, password_hash=hashed_password)
                user.save()
                return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
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
                    return Response({"token": token, "username": username, "message": "Login successful"}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
