# Generated by Django 4.1.13 on 2024-04-09 13:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("project", "0004_remove_project_params_remove_project_sheet"),
    ]

    operations = [
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
                ("lyrics", models.CharField(max_length=50)),
            ],
        ),
        migrations.AlterField(
            model_name="globalparams",
            name="project_id",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE, to="project.project"
            ),
        ),
        migrations.AlterField(
            model_name="params",
            name="track_id",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE, to="project.track"
            ),
        ),
        migrations.AlterField(
            model_name="track",
            name="inst_url",
            field=models.CharField(blank=True, max_length=256),
        ),
        migrations.DeleteModel(
            name="Sheet",
        ),
        migrations.AddField(
            model_name="note",
            name="track_id",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="project.track"
            ),
        ),
    ]