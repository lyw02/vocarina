from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.user_api),
    path('user/<int:user_id>/', views.user_api),
]
