from django.urls import path
from .views import AuctionListView, AuctionStartView, BidCreateView

urlpatterns = [
    path('auctions/',                  AuctionListView.as_view(),  name='auction-list'),
    path('auctions/<int:pk>/start/',   AuctionStartView.as_view(), name='auction-start'),
    path('auctions/<int:pk>/bid/',     BidCreateView.as_view(),    name='auction-bid'),
]
