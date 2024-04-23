from rest_framework import serializers
from .models import User, UserFollowing, UserFollower, LikedComment, LikedMusic, LikedPlaylist


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        exclude = ["password_hash", "is_admin"]


class UserFollowingSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserFollowing
        fields = "__all__"


class UserFollowerSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserFollower
        fields = "__all__"


class LikedCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = LikedComment
        fields = "__all__"


class LikedMusicSerializer(serializers.ModelSerializer):

    class Meta:
        model = LikedMusic
        fields = "__all__"


class LikedPlaylistSerializer(serializers.ModelSerializer):

    class Meta:
        model = LikedPlaylist
        fields = "__all__"
