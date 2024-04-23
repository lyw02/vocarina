from django.db import models


class Music(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey("user.User", on_delete=models.CASCADE)

    title = models.CharField(max_length=50)
    composed_by = models.CharField(max_length=50, blank=True, null=True)
    lyrics_by = models.CharField(max_length=50, blank=True, null=True)
    arranged_by = models.CharField(max_length=50, blank=True, null=True)
    credits = models.JSONField(blank=True, null=True)
    audio_url = models.CharField(max_length=1024)
    cover = models.CharField(max_length=1024, blank=True, null=True)
    lyrics = models.JSONField()
    publish_time = models.DateTimeField(auto_now_add=True)
    play_count = models.IntegerField(default=0)
    like_count = models.IntegerField(default=0)
    save_count = models.IntegerField(default=0)
    status = models.IntegerField(default=1)


class Playlist(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey("user.User", related_name="created_playlists", on_delete=models.CASCADE)
    saved_user_id = models.ManyToManyField("user.User", blank=True, related_name="saved_playlists")
    music_id = models.ManyToManyField("Music", blank=True, related_name="belonged_playlists")

    title = models.CharField(max_length=64)
    description = models.TextField(blank=True, null=True)
    cover = models.CharField(max_length=128)
    create_time = models.DateTimeField(auto_now_add=True)
    last_update = models.DateTimeField(auto_now=True)
    like_count = models.IntegerField(default=0)
    save_count = models.IntegerField(default=0)
    status = models.IntegerField(default=1)


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey("user.User", on_delete=models.CASCADE)
    music_id = models.ForeignKey("Music", on_delete=models.CASCADE)

    content = models.TextField()
    post_time = models.DateTimeField(auto_now_add=True)
    last_update = models.DateTimeField(auto_now=True)
    like_count = models.IntegerField(default=0)
    status = models.IntegerField(default=1)


class Reply(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey("user.User", on_delete=models.CASCADE)
    comment_id = models.ForeignKey("Comment", on_delete=models.CASCADE)
    parent_reply_id = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE)

    content = models.TextField()
    like_count = models.IntegerField(default=0)
    post_time = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField(default=1)
