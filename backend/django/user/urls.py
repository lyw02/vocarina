from django.urls import path
from . import views

urlpatterns = [
    path('api/user/', views.user_api),
    path('api/user/register/', views.user_register),
    path('api/user/login/', views.user_login),
    path('api/user/<int:user_id>/', views.user_api),
]
