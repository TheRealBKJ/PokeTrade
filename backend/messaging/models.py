from django.db import models
from django.contrib.auth.models import User

class Message(models.Model):
    sender    = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    body      = models.TextField()
    sent_at   = models.DateTimeField(auto_now_add=True)
    read      = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender} → {self.recipient} @ {self.sent_at}"
