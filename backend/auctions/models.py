from django.db import models
from django.contrib.auth.models import User

class Auction(models.Model):
    pokemon_name = models.CharField(max_length=100)
    highest_bid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    highest_bidder = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.pokemon_name} - ${self.highest_bid}"
