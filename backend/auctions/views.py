from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Auction
from .serializers import AuctionSerializer
from usercollections.models import UserCollection
from profiles.models import Profile

class AuctionViewSet(viewsets.ModelViewSet):
    queryset = Auction.objects.all()
    serializer_class = AuctionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def buy(self, request, pk=None):
        auction = self.get_object()
        buyer = request.user

        if auction.seller == buyer:
            return Response({'error': 'You cannot buy your own card.'}, status=400)

        buyer_profile = Profile.objects.get(user=buyer)
        if buyer_profile.currency_balance < auction.price:
            return Response({'error': 'Not enough coins'}, status=400)

        try:
            card = UserCollection.objects.get(user=auction.seller, card_id=auction.card_id)
        except UserCollection.DoesNotExist:
            return Response({'error': 'Card not found in seller collection'}, status=404)

        card.user = buyer
        card.save()

        buyer_profile.currency_balance -= auction.price
        buyer_profile.save()

        auction.delete()

        return Response({'message': 'Purchase successful'})
