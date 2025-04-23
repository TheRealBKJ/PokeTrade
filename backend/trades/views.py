from django.shortcuts import render
from rest_framework import generics
from .models import Trade
from .serializers import TradeSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['POST'])
def accept_trade(request, pk):
    try:
        trade = Trade.objects.get(pk=pk, recipient=request.user)
        trade.status = 'accepted'
        trade.save()
        return Response({'message': 'Trade accepted'}, status=status.HTTP_200_OK)
    except Trade.DoesNotExist:
        return Response({'error': 'Trade not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def reject_trade(request, pk):
    try:
        trade = Trade.objects.get(pk=pk, recipient=request.user)
        trade.status = 'rejected'
        trade.save()
        return Response({'message': 'Trade rejected'}, status=status.HTTP_200_OK)
    except Trade.DoesNotExist:
        return Response({'error': 'Trade not found'}, status=status.HTTP_404_NOT_FOUND)

class TradeListCreateView(generics.ListCreateAPIView):
    serializer_class = TradeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Trade.objects.filter(trader=self.request.user) | Trade.objects.filter(recipient=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(trader=self.request.user)