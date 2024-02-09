from django.contrib import admin

from .models import User, UserFollower, UserFollowing

# Register your models here.
admin.site.register(User)
admin.site.register(UserFollower)
admin.site.register(UserFollowing)
