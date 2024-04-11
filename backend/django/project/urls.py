from django.urls import path
from . import views

urlpatterns = [
    # path('api/project/', views.project_api),
    path('api/project/', views.ProjectView.as_view()),
    path('api/project/<int:id>/', views.ProjectView.as_view()),
    # path('api/project/<int:id>/', views.project_api),
    # path('api/project/<int:project_id>/', views.project_api),
    # path('api/project/user/<int:user_id>/', views.project_api),
    path('api/project/audio/process/', views.audio_process_api)
]
