from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse
from django.contrib.auth import authenticate, login
from django.db import connection
from rest_framework.parsers import JSONParser

from .models import User
from .serializer import UserSerializer


# Create your views here.
@csrf_exempt
def user_api(request, user_id=None):

    if user_id is not None and request.method == 'GET':
        user = User.objects.get(id=user_id)
        user_serializer = UserSerializer(user)
        return JsonResponse(user_serializer.data, safe=False, status=201)
    elif request.method == 'GET':
        users = User.objects.all()
        users_serializer = UserSerializer(users, many=True)
        return JsonResponse(users_serializer.data, safe=False, status=201)
    elif request.method == 'POST':
        user = JSONParser().parse(request)
        user_serializer = UserSerializer(data=user)
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse("User created.", safe=False, status=201)
        else:
            print(user_serializer.errors)
        return JsonResponse("Failed to create user.", safe=False, status=400)
    elif request.method == 'PUT':
        new_user = JSONParser().parse(request)
        old_user = User.objects.get(id=new_user['id'])
        user_serializer = UserSerializer(old_user, data=new_user)
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse(f"User {new_user['id']} updated.", safe=False, status=201)
        return JsonResponse(f"Failed to update user {new_user['id']}.", safe=False, status=400)
    elif user_id is not None and request.method == 'DELETE':
        user = User.objects.get(id=user_id)
        user.delete()
        return JsonResponse(f"User {user_id} deleted.", safe=False, status=201)


@csrf_exempt
def login_api(request):

    if request.method == 'POST':
        data = JSONParser().parse(request)
        username = data.get('username')
        password = data.get('password')
        # user = authenticate(request, username=username, password=password)
        user = user_authenticate(username, password)
        print(user)
        if user is not None:
            # login(request, user)
            return JsonResponse(f"User \"{username}\" logged in.", safe=False, status=201)
        else:
            return JsonResponse("Invalid username or password.", safe=False, status=400)


def user_authenticate(username, password):

    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM user_user WHERE username=%s", [username])
        row = cursor.fetchone()
    if row is not None and password == row[2]:  # 假设密码存储在第三列
        user = {'username': row[1]}
        return user

    return None
