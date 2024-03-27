from django.db import models

# Create your models here.


class User(models.Model):
    username = models.CharField(max_length=20)
    password_hash = models.CharField(max_length=256)
    email = models.CharField(max_length=40, blank=True)
    about = models.CharField(max_length=100, blank=True)
    avatar_url = models.CharField(max_length=256, blank=True)
    register_time = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    is_admin = models.BooleanField(default=False)


class UserFollowing(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    following_id = models.IntegerField()
    following_username = models.CharField(max_length=20)


class UserFollower(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    follower_id = models.IntegerField()
    follower_username = models.CharField(max_length=20)
