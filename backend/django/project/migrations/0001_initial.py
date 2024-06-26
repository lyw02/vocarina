# Generated by Django 4.1.13 on 2024-04-16 15:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("user", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Project",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("project_name", models.CharField(max_length=50)),
                ("create_date", models.DateTimeField(auto_now_add=True)),
                ("last_update", models.DateTimeField(auto_now=True)),
                ("status", models.IntegerField(default=1)),
                (
                    "user_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="user.user"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Track",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("track_id", models.IntegerField()),
                ("track_name", models.CharField(max_length=50)),
                ("track_type", models.CharField(max_length=12)),
                ("inst_url", models.CharField(blank=True, max_length=256)),
                ("status", models.IntegerField(default=1)),
                (
                    "project_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="project.project",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Params",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("gain", models.FloatField()),
                (
                    "track_id",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE, to="project.track"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Note",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("note_id", models.IntegerField()),
                ("pitch", models.FloatField()),
                ("start_time", models.FloatField()),
                ("end_time", models.FloatField()),
                ("lyrics", models.CharField(blank=True, max_length=50)),
                (
                    "track_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="project.track"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Lyrics",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("sentence", models.CharField(max_length=128)),
                ("start_time", models.FloatField()),
                ("end_time", models.FloatField()),
                (
                    "project_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="project.project",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="GlobalParams",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("bpm", models.IntegerField()),
                ("time_sig_n", models.IntegerField()),
                ("time_sig_d", models.IntegerField()),
                (
                    "project_id",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="project.project",
                    ),
                ),
            ],
        ),
    ]
