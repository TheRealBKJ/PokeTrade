from rest_framework import generics, permissions
from .models import UserCollection
from .serializers import UserCollectionSerializer
from rest_framework.permissions import AllowAny

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
    permission_classes = [AllowAny]