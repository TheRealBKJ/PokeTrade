from threading import Thread
import random
import requests

from django.apps import apps
from django.contrib.auth.models import User

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .serializers import RegisterSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    """
    POST /api/users/register/
    Returns 201 immediately, then seeds 3–5 random cards in background.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        headers = self.get_success_headers(serializer.data)

        # spawn background thread to seed cards
        Thread(target=self._seed_initial_cards, args=(user,), daemon=True).start()

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def _seed_initial_cards(self, user):
        """
        Dynamically look up the UserCollection model
        and create 3–5 random cards for the new user.
        """
        CardModel = apps.get_model('usercollections', 'UserCollection')
        try:
            resp = requests.get('https://api.pokemontcg.io/v2/cards?pageSize=250')
            resp.raise_for_status()
            cards = resp.json().get('data', [])
            for c in random.sample(cards, k=random.randint(3, 5)):
                CardModel.objects.create(
                    user=user,
                    card_id=c['id'],
                    card_name=c['name'],
                    card_image_url=c['images']['small']
                )
        except Exception as exc:
            # log but don’t fail registration
            print(f"[RegisterView] seeding cards error: {exc}")


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    POST /api/users/login/
    Returns JWT access & refresh tokens
    """
    serializer_class = TokenObtainPairSerializer


class UserProfileView(generics.RetrieveAPIView):
    """
    GET /api/users/profile/
    Returns the logged-in User’s data (id and username).
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
