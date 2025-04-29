from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserCollection
from .serializers import UserCollectionSerializer

class UserCollectionListCreateView(generics.ListCreateAPIView):
    serializer_class = UserCollectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserCollection.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BrowseAllCollectionsView(generics.ListAPIView):
    queryset = UserCollection.objects.all().order_by('-id')
    serializer_class = UserCollectionSerializer
    permission_classes = [permissions.AllowAny]


class SellPokemonView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        # 1️⃣ Find the card
        try:
            card = UserCollection.objects.get(pk=pk, user=request.user)
        except UserCollection.DoesNotExist:
            return Response(
                {'error': 'Card not found in your collection.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # 2️⃣ Credit the user’s profile
        sale_price = 20  # you can make this dynamic later
        profile = request.user.profile
        profile.currency_balance += sale_price
        profile.save()

        # 3️⃣ Remove the card
        card.delete()

        return Response({
            'message': 'Card sold successfully.',
            'amount': sale_price,
            'new_balance': profile.currency_balance
        }, status=status.HTTP_200_OK)
