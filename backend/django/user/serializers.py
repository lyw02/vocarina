from rest_framework import serializers
from .models import User, UserFollowing, UserFollower


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
