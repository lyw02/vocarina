import datetime

from django.db import models
from django.core.serializers.json import DjangoJSONEncoder

# Create your models here.


class Project(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.IntegerField()
    sheet = models.JSONField(encoder=DjangoJSONEncoder)
    params = models.JSONField(encoder=DjangoJSONEncoder, blank=True, null=True)
    create_date = models.DateTimeField(auto_now_add=True)
    last_update = models.DateTimeField(auto_now=True)
    description = models.CharField(max_length=100, blank=True)
    is_deleted = models.BooleanField(default=False)
