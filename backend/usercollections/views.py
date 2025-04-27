from rest_framework import generics, permissions
from .models import UserCollection
from .serializers import UserCollectionSerializer

class UserCollectionListCreateView(generics.ListCreateAPIView):
    serializer_class = UserCollectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserCollection.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
