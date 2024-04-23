from django.urls import path

from . import views

urlpatterns = [
    path('api/music/', views.MusicView.as_view()),
    path('api/music/<int:id>/comment/', views.CommentListCreateView.as_view(), name='music_comment'),
    path('api/music/<int:id>/comment/<int:comment_id>/like/', views.LikedCommentCreateView.as_view(), name='music_comment_like'),
    path('api/playlist/', views.PlaylistView.as_view()),
    path('api/playlist/<int:id>/', views.PlaylistDetailView.as_view(), name='playlist_detail'),
    path('api/playlist/<int:id>/music/', views.PlaylistMusicView.as_view(), name='playlist_music'),
    path('api/user/<int:id>/playlist/', views.SavePlaylistView.as_view()),
    path('api/user/<int:id>/created_playlist/', views.CreatedPlaylistView.as_view(), name='created_playlist'),
    path('api/user/<int:id>/saved_playlist/', views.SavedPlaylistView.as_view(), name='saved_playlist'),
]
