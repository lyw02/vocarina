import datetime

from django.db import models

# Create your models here.


class User(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=10)
    password = models.CharField(max_length=20)
    avatar = models.CharField(max_length=256)
    email = models.CharField(max_length=40)
    register_date = models.DateTimeField(datetime.datetime)
    bio = models.CharField(max_length=100)
