from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from .models import Music
from .pagination import StandardResultsSetPagination
from .serializers import MusicSerializer
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
