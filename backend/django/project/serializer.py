from rest_framework import serializers
from .models import Project, Track, GlobalParams, Lyrics, Params, Note


class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = "__all__"


class TrackSerializer(serializers.ModelSerializer):

    class Meta:
        model = Track
        fields = "__all__"


class GlobalParamsSerializer(serializers.ModelSerializer):

    class Meta:
        model = GlobalParams
        fields = "__all__"


class LyricsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lyrics
        fields = "__all__"


class NoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Note
        fields = "__all__"


class ParamsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Params
        fields = "__all__"
