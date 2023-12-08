from django.urls import path
from . import views

urlpatterns = [
    path('project/', views.project_api),
    path('project/<int:project_id>/', views.project_api),
    path('project/<int:user_id>/', views.project_api),
]
