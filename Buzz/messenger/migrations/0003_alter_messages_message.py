# Generated by Django 5.1 on 2024-10-31 17:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('messenger', '0002_messages_spam'),
    ]

    operations = [
        migrations.AlterField(
            model_name='messages',
            name='message',
            field=models.JSONField(),
        ),
    ]
