from django.urls import path

from . import views

urlpatterns = [
    path('api/music/', views.MusicView.as_view()),
    path('api/playlist/', views.PlaylistView.as_view()),
]
