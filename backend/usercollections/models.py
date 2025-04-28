# backend/usercollections/models.py
from django.db import models
from django.contrib.auth.models import User

class UserCollection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    card_id = models.CharField(max_length=100)
    card_name = models.CharField(max_length=255)
    card_image_url = models.URLField(blank=True, null=True)  # ✅ Add this
    is_listed = models.BooleanField(default=False)  # if you want listing support

    def __str__(self):
        return f"{self.user.username} owns {self.card_name}"

