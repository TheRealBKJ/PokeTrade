from django.urls import path
from .views import (
    ProfileView,
    claim_daily_pack,
    trading_recommendation,
    ChatbotView,
)

urlpatterns = [
    path('profiles/',       ProfileView.as_view(),          name='profile'),
    path('profiles/daily-pack/', claim_daily_pack,          name='claim_daily_pack'),
    path('trading/recommendation/', trading_recommendation,  name='trading_recommendation'),
    path('',        ChatbotView.as_view(),          name='chatbot'),
]
