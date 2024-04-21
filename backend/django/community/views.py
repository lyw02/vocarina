from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView, \
    CreateAPIView
from rest_framework.mixins import ListModelMixin, CreateModelMixin
from rest_framework.response import Response

from .models import Music, Playlist
from .pagination import StandardResultsSetPagination
from .serializers import MusicSerializer, PlaylistSerializer
from .utils.mixing import mix
from .utils.oss import get_file_url, get_file_by_url
from user.models import User
from user.serializers import UserSerializer


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


# class UserPlaylistsView(ListAPIView):
#     """Get all playlists of a user"""
#     serializer_class = PlaylistSerializer
#
#     def get_queryset(self):
#         user_id = self.kwargs["user_id"]
#         return Playlist.objects.filter(user_id=user_id)
#
#
# class PlaylistMusicView(ListAPIView):
#     """Get all musics in a playlist"""
#     serializer_class = MusicSerializer
#
#     def get_queryset(self):
#         playlist_id = self.kwargs["playlist_id"]
#         playlist = get_object_or_404(Playlist, id=playlist_id)
#         return playlist.music_id.all()
#
#
# # 往一个歌单中新增修改或删除音乐
# class PlaylistMusicUpdateView(CreateAPIView, RetrieveUpdateDestroyAPIView):
#     """Add, update or delete music in a playlist"""
#     queryset = Playlist.objects.all()
#     serializer_class = PlaylistSerializer
#
#
# # 用户收藏其他用户创建的歌单
# class UserSavePlaylistView(UpdateAPIView):
#     queryset = Playlist.objects.all()
#     serializer_class = PlaylistSerializer
#
#     def update(self, request, *args, **kwargs):
#         playlist = self.get_object()
#         user = request.user  # 假设你已经设置了身份验证
#         playlist.saved_user_id.add(user)
#         return super().update(request, *args, **kwargs)
