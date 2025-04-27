from django.shortcuts import render
from rest_framework import generics
from .models import Trade
from .serializers import TradeSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


from usercollections.models import UserCollection

@api_view(['POST'])
def accept_trade(request, pk):
    try:
        trade = Trade.objects.get(pk=pk, recipient=request.user)
        
       
        offered_card = UserCollection.objects.get(user=trade.trader, card_id=trade.offered_card_id)
        requested_card = UserCollection.objects.get(user=trade.recipient, card_id=trade.requested_card_id)

        # Swap owners
        offered_card.user, requested_card.user = requested_card.user, offered_card.user
        offered_card.save()
        requested_card.save()

       
        trade.status = 'accepted'
        trade.save()

        return Response({'message': 'Trade accepted and cards swapped!'}, status=status.HTTP_200_OK)
    except Trade.DoesNotExist:
        return Response({'error': 'Trade not found'}, status=status.HTTP_404_NOT_FOUND)
    except UserCollection.DoesNotExist:
        return Response({'error': 'One or both cards not found in collections'}, status=status.HTTP_400_BAD_REQUEST)

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