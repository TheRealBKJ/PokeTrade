from django.urls import path
from .views import claim_daily_pack

urlpatterns = [
    path('claim_daily_pack/', claim_daily_pack, name='claim_daily_pack'),
]
