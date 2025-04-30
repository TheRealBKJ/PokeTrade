from django.urls import path
from .views import TradeListCreateView, accept_trade, reject_trade

urlpatterns = [
    path('',            TradeListCreateView.as_view(), name='trade-list-create'),
    path('<int:pk>/accept/', accept_trade, name='accept-trade'),
    path('<int:pk>/reject/', reject_trade, name='reject-trade'),
]
