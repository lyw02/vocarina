from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views
# from .views import ProjectViewSet

# router = DefaultRouter()
# router.register(r'api/project', ProjectViewSet)

urlpatterns = [
    # path('', include(router.urls)),

    # path('api/project/', views.project_api),
    path('api/project/', views.ProjectView.as_view()),
    path('api/project/<int:id>/', views.ProjectView.as_view()),
    # path('api/project/<int:id>/', views.project_api),
    # path('api/project/<int:project_id>/', views.project_api),
    # path('api/project/user/<int:user_id>/', views.project_api),

    path('api/project/audio/process/', views.audio_process_api)
]
