from django.urls import path
from . import views

urlpatterns = [
    path('api/user/auth/', views.UserAuthView.as_view()),
    path('api/user/', views.UserView.as_view()),
    path('api/user/<int:id>/', views.UserView.as_view()),
]
