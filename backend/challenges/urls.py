from django.urls import path
from .views import DailyChallengesView, ClaimChallengeRewardView

urlpatterns = [
    path('daily/', DailyChallengesView.as_view(), name='daily-challenges'),
    path('claim/<int:challenge_id>/', ClaimChallengeRewardView.as_view(), name='claim-challenge'),
]