from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Listing, ListingBid
from .serializers import ListingSerializer, BidSerializer

class AuctionListView(generics.ListAPIView):
    """
    GET /api/auctions/ → list active auctions
    """
    serializer_class   = ListingSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        now = timezone.now()
        return Listing.objects.filter(is_auction=True, end_time__gt=now)

class AuctionStartView(generics.UpdateAPIView):
    """
    PATCH /api/auctions/{pk}/start/  (owner only) → start an auction
    """
    queryset           = Listing.objects.all()
    serializer_class   = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        lst = get_object_or_404(Listing, pk=pk, owner=request.user)
        hours = int(request.data.get('duration_hours', 24))
        lst.starting_price = int(request.data.get('starting_price', 0))
        lst.start_auction(hours=hours)
        return Response(ListingSerializer(lst).data)

class BidCreateView(generics.CreateAPIView):
    """
    POST /api/auctions/{pk}/bid/ → place a bid
    """
    serializer_class   = BidSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        listing = get_object_or_404(Listing, pk=pk, is_auction=True, end_time__gt=timezone.now())
        try:
            amt = int(request.data.get('amount', 0))
        except:
            return Response({'error':'Invalid amount.'}, status=status.HTTP_400_BAD_REQUEST)
        if amt <= listing.current_price:
            return Response({'error':'Bid must exceed current price.'}, status=status.HTTP_400_BAD_REQUEST)
        bid = ListingBid.objects.create(listing=listing, bidder=request.user, amount=amt)
        listing.current_price = amt
        listing.save()
        return Response(BidSerializer(bid).data, status=status.HTTP_201_CREATED)
