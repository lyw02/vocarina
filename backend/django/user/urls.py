from django.urls import path
from . import views

urlpatterns = [
    path('api/user/', views.user_api),
    path('api/user/login/', views.login_api),
    path('api/user/<int:user_id>/', views.user_api),
]
