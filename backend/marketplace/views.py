from rest_framework import generics, permissions, serializers
from .models import Listing
from .serializers import ListingSerializer
from usercollections.models import UserCollection

class ListingListCreateView(generics.ListCreateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    # backend/marketplace/views.py
    def perform_create(self, serializer):
        card_id = serializer.validated_data['card_id']
        try:
            card = UserCollection.objects.get(user=self.request.user, card_id=card_id)
            listing = serializer.save(owner=self.request.user)
            card.is_listed = True
            card.save()
        except UserCollection.DoesNotExist:
            raise serializers.ValidationError("You don't own this card.")

