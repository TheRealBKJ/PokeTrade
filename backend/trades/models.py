from django.db import models
from django.contrib.auth.models import User

class Trade(models.Model):
    # — Static status constants your views can reference —
    PENDING  = 'pending'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'

    # — Static list of choices for the status field —
    STATUS_CHOICES = [
        (PENDING,  'Pending'),
        (ACCEPTED, 'Accepted'),
        (REJECTED, 'Rejected'),
    ]

    trader            = models.ForeignKey(
        User,
        related_name='trades_offered',
        on_delete=models.CASCADE
    )
    recipient         = models.ForeignKey(
        User,
        related_name='trades_received',
        on_delete=models.CASCADE
    )
    offered_card_id   = models.CharField(max_length=100)
    requested_card_id = models.CharField(max_length=100)
    status            = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        # We just show the raw status code here.
        return f"Trade from {self.trader} → {self.recipient} [{self.status}]"
