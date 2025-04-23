from django.db import models
from django.contrib.auth.models import User

class Listing(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    card_id = models.CharField(max_length=100)  # TCG API card id
    card_name = models.CharField(max_length=255)
    card_image_url = models.URLField()

    listing_type = models.CharField(max_length=10, choices=[
        ('trade', 'Trade'),
        ('sale', 'Sale')
    ], default='trade')

    price = models.IntegerField(null=True, blank=True)  # Only if it's for sale

    is_active = models.BooleanField(default=True)  # Listing still active or not
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.card_name} by {self.owner.username}"