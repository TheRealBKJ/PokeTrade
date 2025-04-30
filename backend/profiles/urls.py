from django.urls import path
from .views import ProfileView, claim_daily_pack

urlpatterns = [
    # GET  /api/profiles/                 → fetch the current user’s profile
    path('', ProfileView.as_view(), name='profile-view'),

    # POST /api/profiles/daily-pack/      → claim your daily pack
    path('daily-pack/', claim_daily_pack, name='claim-daily-pack'),
]
