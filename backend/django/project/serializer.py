from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = ('id', 'user_id', 'sheet', 'params', 'create_date', 'last_update', 'description', 'is_deleted')
