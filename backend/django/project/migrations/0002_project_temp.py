# Generated by Django 4.1.13 on 2024-04-16 15:35

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("project", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="temp",
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]