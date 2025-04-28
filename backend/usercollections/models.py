from django.contrib.auth.models import User
from django.db import models

class UserCollection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    card_id = models.CharField(max_length=100)
    card_name = models.CharField(max_length=255)
    card_image = models.URLField()
    date_added = models.DateTimeField(auto_now_add=True)
    is_listed = models.BooleanField(default=False)  # 🔥 NEW FIELD

    def __str__(self):
        return f"{self.user.username} owns {self.card_name}"
