from rest_framework import viewsets
from .models import Auction
from .serializers import AuctionSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class AuctionViewSet(viewsets.ModelViewSet):
    queryset = Auction.objects.all()
    serializer_class = AuctionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
