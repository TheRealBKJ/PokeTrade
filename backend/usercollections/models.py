from django.db import models
from django.contrib.auth.models import User

class UserCollection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_listed = models.BooleanField(default=False)
    card_id = models.CharField(max_length=255)
    card_name = models.CharField(max_length=255)
    card_image_url = models.URLField(null=True, blank=True, default='')  # Allow null and provide a default empty string

    def __str__(self):
        return f"{self.card_name} owned by {self.user.username}"
