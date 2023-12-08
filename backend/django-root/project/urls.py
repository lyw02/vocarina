from django.urls import path
from . import views

urlpatterns = [
    path('project/', views.project_api),
    path('project/<int:project_id>/', views.project_api),
    path('project/user/<int:user_id>/', views.project_api),
    path('project/audio/process/', views.audio_process_api)
]
