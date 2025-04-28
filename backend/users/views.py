import random
import requests

from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .serializers import RegisterSerializer, UserSerializer
from usercollections.models import UserCollection


class RegisterView(generics.CreateAPIView):
    """
    POST /api/users/register/
    Creates a new User and seeds them with 3–5 random Pokémon cards.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()

        # fetch a batch of Pokémon card data and assign a random subset
        try:
            response = requests.get(
                'https://api.pokemontcg.io/v2/cards?pageSize=250'
            )
            if response.status_code == 200:
                cards = response.json().get('data', [])
                random_cards = random.sample(cards, k=random.randint(3, 5))
                for card in random_cards:
                    UserCollection.objects.create(
                        user=user,
                        card_id=card['id'],
                        card_name=card['name'],
                        card_image_url=card['images']['small']
                    )
            else:
                print("Failed to fetch Pokémon cards:", response.status_code)
        except Exception as e:
            print("Error fetching/assigning Pokémon cards:", e)


class UserProfileView(generics.RetrieveAPIView):
    """
    GET /api/users/profile/
    Returns the authenticated user’s data.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extends JWT payload to include username and user_id.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['user_id'] = user.id
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user_id'] = self.user.id
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    POST /api/users/token/
    Uses the above serializer to return access & refresh tokens + user_id.
    """
    serializer_class = CustomTokenObtainPairSerializer
