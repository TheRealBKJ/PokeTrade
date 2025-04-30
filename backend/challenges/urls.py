from django.urls import path
from .views import DailyChallengesView, claim_challenge

urlpatterns = [
    # GET  /api/challenges/daily/         → list/take today’s challenges
    path('daily/', DailyChallengesView.as_view(), name='daily-challenges'),
    # POST /api/challenges/claim/<pk>/    → claim a completed challenge
    path('claim/<int:pk>/', claim_challenge, name='claim-challenge'),
]
