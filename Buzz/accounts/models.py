from django.db import models

from Crypto.PublicKey import RSA

import base64

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
    picture = models.FileField(default='defaultpp.jpg', upload_to='profilepictures/')
    private_key = models.TextField(blank=True, null=True)
    public_key = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.private_key or not self.public_key:
            private_key_obj, public_key_obj = generate_rsa_keys()
            # Save the keys as base64-encoded strings
            self.private_key = base64.b64encode(private_key_obj.export_key()).decode('utf-8')
            self.public_key = base64.b64encode(public_key_obj.export_key()).decode('utf-8')
        super(User, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.id} Profile'
    
def generate_rsa_keys():
    key = RSA.generate(2048)
    private_key = key.export_key()
    public_key = key.publickey().export_key()

    # Store the keys securely (in environment variables, files, or database)
    return RSA.import_key(private_key),RSA.import_key(public_key) 
