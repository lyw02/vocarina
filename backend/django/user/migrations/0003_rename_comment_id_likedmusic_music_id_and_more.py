# Generated by Django 4.1.13 on 2024-04-23 22:39

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("user", "0002_likedplaylist_likedmusic_likedcomment"),
    ]

    operations = [
        migrations.RenameField(
            model_name="likedmusic",
            old_name="comment_id",
            new_name="music_id",
        ),
        migrations.RenameField(
            model_name="likedplaylist",
            old_name="comment_id",
            new_name="playlist_id",
        ),
    ]