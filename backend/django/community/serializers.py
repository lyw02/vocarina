from rest_framework import serializers

from .models import Music, Playlist


class MusicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Music
        fields = "__all__"


class PlaylistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Playlist
        fields = "__all__"
