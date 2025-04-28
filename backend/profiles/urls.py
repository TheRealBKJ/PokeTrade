from django.urls import path
from .views import ProfileView,claim_daily_pack

urlpatterns = [
    path('', ProfileView.as_view(), name='profile-view'),  # EMPTY '' path
    path('daily-pack/', claim_daily_pack, name='daily-pack'),
]
