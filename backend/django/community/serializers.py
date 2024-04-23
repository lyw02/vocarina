from rest_framework import serializers

from .models import Music, Playlist, Comment, Reply


class MusicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Music
        fields = "__all__"


class PlaylistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Playlist
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = "__all__"


class ReplySerializer(serializers.ModelSerializer):

    class Meta:
        model = Reply
        fields = "__all__"
