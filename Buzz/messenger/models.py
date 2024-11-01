from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Messages(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    message = models.JSONField(default=dict)
    time_sent = models.DateTimeField(auto_now_add=True)
    attachment = models.FileField(null=True, blank=True ,upload_to='attachments/')
    spam = models.BooleanField(default=False)  

    def __str__(self):
        return f"From {self.sender} to {self.receiver}: {str(self.message)[:20]}"

