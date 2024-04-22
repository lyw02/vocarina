from django.urls import path

from . import views

urlpatterns = [
    path('api/music/', views.MusicView.as_view()),
    path('api/playlist/', views.PlaylistView.as_view()),
    path('api/user/<int:id>/playlist/', views.SavePlaylistView.as_view()),
    path('api/user/<int:id>/created_playlist/', views.CreatedPlaylistView.as_view(), name='created_playlist'),
    path('api/user/<int:id>/saved_playlist/', views.SavedPlaylistView.as_view(), name='saved_playlist'),
]
