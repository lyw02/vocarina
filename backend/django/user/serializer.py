from rest_framework import serializers
from .models import User, UserFollowing, UserFollower


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'password_hash', 'avatar', 'email', 'register_time', 'last_login', 'about')


class UserFollowingSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserFollowing
        fields = ('user_id', 'following_id', 'username')


class UserFollowerSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserFollower
        fields = ('user_id', 'follower_id', 'username')
