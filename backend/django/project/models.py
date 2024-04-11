from django.db import models
from django.core.serializers.json import DjangoJSONEncoder

# Create your models here.


class Project(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey("user.User", on_delete=models.CASCADE)

    project_name = models.CharField(max_length=50)
    create_date = models.DateTimeField(auto_now_add=True)
    last_update = models.DateTimeField(auto_now=True)
    status = models.IntegerField(default=1)


class Track(models.Model):
    id = models.AutoField(primary_key=True)
    project_id = models.ForeignKey("Project", on_delete=models.CASCADE)

    track_id = models.IntegerField()
    track_name = models.CharField(max_length=50)
    track_type = models.CharField(max_length=12)
    inst_url = models.CharField(max_length=256, blank=True)
    status = models.IntegerField(default=1)


class GlobalParams(models.Model):
    project_id = models.OneToOneField("Project", on_delete=models.CASCADE)

    bpm = models.IntegerField()
    time_sig_n = models.IntegerField()
    time_sig_d = models.IntegerField()


class Lyrics(models.Model):
    project_id = models.ForeignKey("Project", on_delete=models.CASCADE)

    sentence = models.CharField(max_length=128)
    start_time = models.FloatField()
    end_time = models.FloatField()


class Note(models.Model):
    track_id = models.ForeignKey("Track", on_delete=models.CASCADE)

    note_id = models.IntegerField()
    pitch = models.FloatField()
    start_time = models.FloatField()
    end_time = models.FloatField()
    lyrics = models.CharField(max_length=50)


class Params(models.Model):
    track_id = models.OneToOneField("Track", on_delete=models.CASCADE)

    gain = models.FloatField()
