from django.db import models
from django.conf import settings
from datetime import date

class ChallengeTemplate(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    reward = models.IntegerField(default=10)
    date = models.DateField(default=date.today)

    def __str__(self):
        return f"{self.name} ({self.date})"

class UserChallenge(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    challenge = models.ForeignKey(ChallengeTemplate, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    claimed = models.BooleanField(default=False)
    notified = models.BooleanField(default=False)  # tracks if notification sent for new challenge

    class Meta:
        unique_together = ('user', 'challenge')

    def __str__(self):
        return f"{self.user.username} – {self.challenge.name}"