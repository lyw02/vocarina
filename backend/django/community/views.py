from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from .models import Music
from .serializers import MusicSerializer
from .utils.mixing import mix
from .utils.oss import get_file_url, get_file_by_url
from user.models import User


class MusicView(GenericAPIView):
    queryset = Music.objects.all()
    serializer_class = MusicSerializer
    lookup_field = "id"

    def post(self, request):

        if request.query_params.get("action") == "publish":

            mix_res = mix(request.data.get("username"), request.data.get("project_name"), request.data.get("data"))
            file_url = get_file_url(request.data.get("project_name"))
            user_id = request.data.get("user_id")
            user = User.objects.get(id=user_id)
            print(f"user.id: {user.id}")
            data_to_ser = {
                "user_id": user.id,
                "title": request.data.get("project_name"),
                "audio_url": file_url,
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
