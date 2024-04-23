from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView, \
    CreateAPIView, ListCreateAPIView, RetrieveAPIView
from rest_framework.mixins import ListModelMixin, CreateModelMixin, UpdateModelMixin
from rest_framework.response import Response

from .models import Music, Playlist, Comment, Reply
from .pagination import StandardResultsSetPagination
from .serializers import MusicSerializer, PlaylistSerializer, CommentSerializer, ReplySerializer
from .utils.mixing import mix
from .utils.oss import get_file_url, get_file_by_url
from user.models import User, LikedComment, LikedMusic
from user.serializers import UserSerializer, LikedCommentSerializer, LikedMusicSerializer


class MusicView(GenericAPIView):
    queryset = Music.objects.all()
    serializer_class = MusicSerializer
    lookup_field = "id"
    pagination_class = StandardResultsSetPagination

    def post(self, request):
        """
        @query param "action"
            publish -> publish new music
        """
        if request.query_params.get("action") == "publish":

            mix_res = mix(request.data.get("username"), request.data.get("project_name"), request.data.get("data"))
            # file_url = get_file_url(f"music/{request.data.get('username')}/{request.data.get('project_name')}.wav")
            user_id = request.data.get("user_id")
            user = User.objects.get(id=user_id)
            print(f"user.id: {user.id}")
            data_to_ser = {
                "user_id": user.id,
                "title": request.data.get("project_name"),
                "audio_url": mix_res,  # Path in OSS
                "lyrics": request.data.get("lyrics"),
                "composed_by": request.data.get("composed_by"),
                "lyrics_by": request.data.get("lyrics_by"),
                "arranged_by": request.data.get("arranged_by"),
                "credits": request.data.get("credits"),
            }
            print(f"data_to_ser: {data_to_ser}")

            serializer = self.get_serializer(data=data_to_ser)
            if serializer.is_valid():
                serializer.save()

                return Response(mix_res, status=status.HTTP_200_OK)

            else:
                print(f"serializer.errors: {serializer.errors}")
                return Response({"message": serializer.errors},
                                status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        """
        @query param "page" *required
        @query param "user_id"
            <None> -> Get all musics
            <int> -> Get all musics of a user
        """
        user_id = request.query_params.get("user_id")
        if user_id is not None and isinstance(int(user_id), int):
            # Get all musics of a user
            queryset = self.get_queryset().filter(user_id=user_id)
        else:
            # Get all musics
            queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            res = []
            for music in serializer.data:
                user_id = music.get("user_id")
                try:
                    user = User.objects.get(id=user_id)
                    username = user.username
                except User.DoesNotExist:
                    username = None
                music["username"] = username
                music["url"] = get_file_url(f"music/{username}/{music.get('title')}")
                res.append(music)
            return self.get_paginated_response(res)
        else:
            return Response("No Data", status=status.HTTP_404_NOT_FOUND)


class PlaylistView(ListModelMixin, CreateModelMixin, GenericAPIView):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer
    lookup_field = "id"
    pagination_class = StandardResultsSetPagination

    def get(self, request, *args, **kwargs):
        """Get all playlists"""
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """Create a new playlist"""
        user_id = request.data.get("user_id")
        print(user_id)
        if not user_id:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        data_to_ser = {
            "user_id": user_id,
            "title": request.data.get("title"),
            "description": request.data.get("description"),
            "cover": f"https://picsum.photos/seed/{request.data.get('title')}/200"
        }
        serializer = self.get_serializer(data=data_to_ser)
        if serializer.is_valid():
            serializer.save()
            return Response("Success", status=status.HTTP_200_OK)
        else:
            print(f"serializer.errors: {serializer.errors}")
            return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class PlaylistDetailView(RetrieveAPIView):
    """Get detail of a single playlist"""
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer
    lookup_field = "id"


class PlaylistMusicView(ListAPIView, GenericAPIView, UpdateModelMixin):
    queryset = Playlist.objects.all()
    serializer_class = MusicSerializer
    lookup_field = "id"
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        """Get all music of a playlist"""
        playlist_id = self.kwargs["id"]
        playlist = Playlist.objects.get(id=playlist_id)
        return playlist.music_id.all()

    def post(self, request, *args, **kwargs):
        """Save a music to a playlist"""
        self.serializer_class = PlaylistSerializer
        playlist_id = self.kwargs["id"]
        playlist = Playlist.objects.get(id=playlist_id)
        music_id = request.data.get("musicId")
        music = Music.objects.get(id=music_id)

        if music:
            playlist.music_id.add(music)
            playlist.save()
            return Response(self.get_serializer(playlist).data, status=status.HTTP_200_OK)

        return Response({"error": "Music not found"}, status=status.HTTP_404_NOT_FOUND)


class SavePlaylistView(GenericAPIView, CreateModelMixin):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer
    # pagination_class = StandardResultsSetPagination

    def get(self, request, *args, **kwargs):
        """Get all created playlists of a user"""
        user = User.objects.get(id=self.kwargs["id"])
        playlists = Playlist.objects.filter(user_id=user)
        return Response(self.get_serializer(playlists, many=True).data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """Save playlist"""
        user = User.objects.get(id=self.kwargs["id"])
        playlist = Playlist.objects.get(id=request.data["playlist_id"])
        playlist.saved_user_id.add(user)
        playlist.save()
        return Response(self.get_serializer(playlist).data, status=status.HTTP_201_CREATED)


class CreatedPlaylistView(ListAPIView):
    serializer_class = PlaylistSerializer

    def get_queryset(self):
        """Get created playlists"""
        user = User.objects.get(id=self.kwargs["id"])
        return Playlist.objects.filter(user_id=user)


class SavedPlaylistView(ListAPIView):
    serializer_class = PlaylistSerializer

    def get_queryset(self):
        """Get saved playlists"""
        user = User.objects.get(id=self.kwargs["id"])
        return user.saved_playlists.all()


class CommentListCreateView(ListCreateAPIView):
    """
    Get all comments
    Create new comment
    """
    serializer_class = CommentSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        music_id = self.kwargs["id"]
        return Comment.objects.filter(music_id=music_id)

    def perform_create(self, serializer):
        music_id = self.kwargs["id"]
        user_id = self.request.data.get("user_id")
        music = Music.objects.get(id=music_id)
        user = User.objects.get(id=user_id)
        serializer.save(user_id=user, music_id=music)


class CommentDetailView(RetrieveUpdateDestroyAPIView):
    """Get or update a single comment"""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


class ReplyCreateView(CreateAPIView):
    """Create a new reply"""
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer

    def perform_create(self, serializer):
        # music_id = self.kwargs["id"]
        # user_id = self.request.data.get("user_id")
        # music = Music.objects.get(id=music_id)
        # user = User.objects.get(id=user_id)
        serializer.save(user_id=self.request.user)


class ReplyReplyCreateView(CreateAPIView):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user)


class LikedCommentCreateView(CreateAPIView):
    """
    POST: Like a comment
    GET: Whether the comment has been liked by user, and total like count
    """
    queryset = LikedComment.objects.all()
    serializer_class = LikedCommentSerializer

    def post(self, request, *args, **kwargs):
        user_id = self.request.data.get("userId")
        comment_id = kwargs.get("comment_id")
        user = User.objects.get(id=user_id)
        comment = Comment.objects.get(id=comment_id)
        like, created = LikedComment.objects.get_or_create(user_id=user, comment_id=comment)
        if created:
            return Response({"message": "Success"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "Already liked"}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        user_id = request.query_params.get("userId")
        comment_id = kwargs.get("comment_id")
        is_liked = LikedComment.objects.filter(user_id=user_id, comment_id=comment_id).exists()
        likes_count = LikedComment.objects.filter(comment_id=comment_id).count()
        return Response({"is_liked": is_liked, "likes_count": likes_count}, status=status.HTTP_200_OK)


class LikedMusicCreateView(CreateAPIView):
    """
    POST: Like a music
    GET: Whether the music has been liked by user, and total like count
    """
    queryset = LikedMusic.objects.all()
    serializer_class = LikedMusicSerializer
    lookup_field = "id"

    def post(self, request, *args, **kwargs):
        user_id = self.request.data.get("userId")
        music_id = self.kwargs["id"]
        print(music_id)
        user = User.objects.get(id=user_id)
        music = Music.objects.get(id=music_id)
        like, created = LikedMusic.objects.get_or_create(user_id=user, music_id=music)
        if created:
            return Response({"message": "Success"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "Already liked"}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        user_id = request.query_params.get("userId")
        music_id = kwargs.get("id")
        is_liked = LikedMusic.objects.filter(user_id=user_id, music_id=music_id).exists()
        likes_count = LikedMusic.objects.filter(music_id=music_id).count()
        return Response({"is_liked": is_liked, "likes_count": likes_count}, status=status.HTTP_200_OK)
