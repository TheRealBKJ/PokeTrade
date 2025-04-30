# auctions/models.py
from django.db import models
from django.contrib.auth.models import User

class Auction(models.Model):
    seller = models.ForeignKey(User, on_delete=models.CASCADE)
    card_id = models.CharField(max_length=100)
    card_name = models.CharField(max_length=100)
    card_image_url = models.URLField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.card_name} - {self.price} by {self.seller.username}"