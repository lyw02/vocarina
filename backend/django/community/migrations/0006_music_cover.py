# Generated by Django 4.1.13 on 2024-04-23 17:22

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("community", "0005_alter_playlist_music_id_alter_playlist_saved_user_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="music",
            name="cover",
            field=models.CharField(blank=True, max_length=1024, null=True),
        ),
    ]