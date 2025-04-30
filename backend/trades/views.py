from rest_framework import generics, permissions, status as drf_status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Trade
from .serializers import TradeSerializer

class TradeListCreateView(generics.ListCreateAPIView):
    serializer_class   = TradeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return (
            Trade.objects.filter(trader=user) |
            Trade.objects.filter(recipient=user)
        )

    def perform_create(self, serializer):
        serializer.save(trader=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def accept_trade(request, pk):
    try:
        trade = Trade.objects.get(pk=pk, recipient=request.user)
    except Trade.DoesNotExist:
        return Response({'error': 'Trade not found'},
                        status=drf_status.HTTP_404_NOT_FOUND)

    # simply update the status
    trade.status = Trade.ACCEPTED
    trade.save()
    return Response({'message': 'Trade accepted.'},
                    status=drf_status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def reject_trade(request, pk):
    try:
        trade = Trade.objects.get(pk=pk, recipient=request.user)
    except Trade.DoesNotExist:
        return Response({'error': 'Trade not found'},
                        status=drf_status.HTTP_404_NOT_FOUND)

    trade.status = Trade.REJECTED
    trade.save()
    return Response({'message': 'Trade rejected.'},
                    status=drf_status.HTTP_200_OK)
