from django.db import models
from django.contrib.auth.models import User

class Auction(models.Model):
    # Allow existing rows to survive: seller can be null
    seller = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    # New card fields: give harmless defaults
    card_id = models.CharField(
        max_length=100,
        default='',
        blank=True
    )
    card_name = models.CharField(
        max_length=100,
        default='',
        blank=True
    )
    card_image_url = models.URLField(
        default='',
        blank=True
    )

    # Price gets a default of 0.00
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        seller = self.seller.username if self.seller else "Unknown"
        return f"{self.card_name} - {self.price} by {seller}"
