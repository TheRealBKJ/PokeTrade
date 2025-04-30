# add below your Listing model in backend/marketplace/models.py

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

class Listing(models.Model):
    owner           = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    card_id         = models.CharField(max_length=50)
    card_name       = models.CharField(max_length=100)
    card_image_url  = models.URLField()
    is_trade        = models.BooleanField(default=True)

    # ↓ Auction fields ↓
    is_auction      = models.BooleanField(default=False)
    starting_price  = models.PositiveIntegerField(null=True, blank=True)
    current_price   = models.PositiveIntegerField(null=True, blank=True)
    end_time        = models.DateTimeField(null=True, blank=True)

    def start_auction(self, hours=24):
        self.is_auction     = True
        self.starting_price = self.starting_price or 0
        self.current_price  = self.starting_price
        self.end_time       = timezone.now() + timedelta(hours=hours)
        self.save()
# append this model to the same file:

class ListingBid(models.Model):
    listing    = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='bids')
    bidder     = models.ForeignKey(User, on_delete=models.CASCADE)
    amount     = models.PositiveIntegerField()
    placed_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-amount', 'placed_at']
