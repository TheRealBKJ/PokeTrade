from django.urls import path
from . import views
from .views import TradeListCreateView
from .views import accept_trade
from .views import reject_trade

urlpatterns = [
    path('', TradeListCreateView.as_view(), name='trade-list-create'),
    path('<int:pk>/accept/', accept_trade, name='accept-trade'),
    path('<int:pk>/reject/', reject_trade, name='reject-trade'),
]