from django.db import models
from django.contrib.auth.models import User

class Trade(models.Model):
    PENDING  = 'pending'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'

    trader    = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='trades_made'
    )
    recipient = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='trades_received'
    )
    offered_card_id   = models.IntegerField()
    requested_card_id = models.IntegerField()
    status = models.CharField(
        max_length=10,
        choices=[
            (PENDING,  PENDING),
            (ACCEPTED, ACCEPTED),
            (REJECTED, REJECTED),
        ],
        default=PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.trader.username} offers #{self.offered_card_id} for #{self.requested_card_id} [{self.status}]"
