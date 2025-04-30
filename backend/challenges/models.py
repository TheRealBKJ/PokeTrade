from django.db import models
from django.conf import settings
from datetime import date

class ChallengeTemplate(models.Model):
    """
    A “template” for a daily challenge.
    You could seed the database with one per day or reuse a small set.
    """
    name = models.CharField(max_length=100)
    description = models.TextField()
    reward = models.IntegerField(default=10)             # e.g. 10 coins
    date = models.DateField(default=date.today)          # which day this template is for

    def __str__(self):
        return f"{self.name} ({self.date})"


class UserChallenge(models.Model):
    """
    A user’s instance of a daily challenge.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    challenge = models.ForeignKey(ChallengeTemplate, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    claimed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'challenge')

    def __str__(self):
        return f"{self.user.username} – {self.challenge.name}"
