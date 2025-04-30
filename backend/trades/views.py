from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status as drf_status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Trade
from .serializers import TradeSerializer

from usercollections.models import UserCollection  

class TradeListCreateView(generics.ListCreateAPIView):
    """
    POST /api/trades/         ➔ create a trade (recipient omitted)
    GET  /api/trades/?pending=1 ➔ list all pending trades
    GET  /api/trades/         ➔ list your trades (made or received)
    """
    serializer_class   = TradeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Trade.objects.all()
        if self.request.query_params.get('pending') == '1':
            return qs.filter(status=Trade.PENDING)
        user = self.request.user
        return qs.filter(Q(trader=user) | Q(recipient=user))

    def perform_create(self, serializer):
        trader = self.request.user
        offered_id   = serializer.validated_data['offered_card_id']
        requested_id = serializer.validated_data['requested_card_id']

        # OPTIONAL: add any ownership validation here
        # e.g. ensure the trader really owns offered_id, etc.

        serializer.save(trader=trader)
# 👈 you need this import

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def accept_trade(request, pk):
    """
    POST /api/trades/{pk}/accept/
    Swaps card ownership between trader and recipient and marks trade as accepted.
    """
    trade = get_object_or_404(Trade, pk=pk, status=Trade.PENDING)

    if request.user == trade.trader:
        return Response({'error': 'You cannot accept your own trade.'},
                        status=drf_status.HTTP_403_FORBIDDEN)

    try:
        offered_card = UserCollection.objects.get(user=trade.trader, card_id=trade.offered_card_id)
        requested_card = UserCollection.objects.get(user=request.user, card_id=trade.requested_card_id)
    except UserCollection.DoesNotExist:
        return Response({'error': 'One or both cards not found in collections.'},
                        status=drf_status.HTTP_404_NOT_FOUND)

    # 🔁 Swap ownership
    offered_card.user, requested_card.user = requested_card.user, offered_card.user
    offered_card.save()
    requested_card.save()

    # ✅ Update trade status
    trade.recipient = request.user
    trade.status = Trade.ACCEPTED
    trade.save()

    return Response({'message': '✅ Trade accepted and cards swapped.'}, status=drf_status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def reject_trade(request, pk):
    """
    POST /api/trades/{pk}/reject/
    Sets recipient=request.user, swaps status to REJECTED.
    """
    trade = get_object_or_404(Trade, pk=pk, status=Trade.PENDING)
    # allow either trader or acceptor to reject
    if request.user not in (trade.trader, trade.recipient):
        return Response(
            {'error': 'Not permitted to reject this trade.'},
            status=drf_status.HTTP_403_FORBIDDEN
        )

    trade.recipient = request.user
    trade.status    = Trade.REJECTED
    trade.save()
    return Response({'message': 'Trade rejected.'}, status=drf_status.HTTP_200_OK)
