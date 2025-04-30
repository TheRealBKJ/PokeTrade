from django.urls import path
from .views import DailyChallengesView, complete_challenge

urlpatterns = [
    # GET  /api/challenges/daily/      → fetch today's challenges
    path('daily/', DailyChallengesView.as_view(), name='daily-challenges'),
    # PATCH /api/challenges/complete/<pk>/ → mark complete & spawn new + notify
    path('complete/<int:pk>/', complete_challenge, name='complete-challenge'),
]