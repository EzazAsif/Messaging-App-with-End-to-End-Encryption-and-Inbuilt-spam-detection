from django.db import models

from django.contrib.auth.models import AbstractUser



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