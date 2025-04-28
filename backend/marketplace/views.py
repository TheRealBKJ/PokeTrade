from rest_framework import generics, permissions
from .models import Listing
from .serializers import ListingSerializer
from usercollections.models import UserCollection

class ListingListCreateView(generics.ListCreateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        listing = serializer.save(owner=self.request.user)

        # ✅ Update user's collection to mark the card as "listed"
        try:
            card = UserCollection.objects.get(user=self.request.user, card_id=listing.card_id)
            card.is_listed = True
            card.save()
        except UserCollection.DoesNotExist:
            pass  # Optionally raise error if they try to list a card they don't own
