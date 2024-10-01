from django.db import models
from django.contrib.auth.models import AbstractUser

class Messages(models.Model):
    sender = models.IntegerField()
    message = models.CharField(max_length=200)
    receiver = models.IntegerField()
    time_sent = models.DateTimeField(auto_now_add=True)
    attachment = models.FileField(null=True, blank=True)

class User(AbstractUser):
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',  # Change related_name to something unique
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions_set',  # Change related_name to something unique
        blank=True
    )
    profileid = models.IntegerField()
    picture = models.FileField( default='defaultpp.jpg',upload_to='profilepictures/')

    def __str__(self):
        return f'{self.id} Profile'

