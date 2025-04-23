
from django.db import models
from django.contrib.auth.models import User

class Trade(models.Model):
    trader = models.ForeignKey(User, related_name='trades_offered', on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, related_name='trades_received', on_delete=models.CASCADE)
    
    offered_card_id = models.CharField(max_length=100)  # TCG API card ID
    requested_card_id = models.CharField(max_length=100)  # TCG API card ID

    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected')
    ], default='pending')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Trade from {self.trader} to {self.recipient} - Status: {self.status}"
