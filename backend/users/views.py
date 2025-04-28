from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegisterSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import random
import requests
from usercollections.models import UserCollection  # ✅ import your UserCollection model

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()

        try:
            response = requests.get('https://api.pokemontcg.io/v2/cards?pageSize=250')
            if response.status_code == 200:
                cards = response.json()['data']

                random_cards = random.sample(cards, k=random.randint(3, 5))  # ✅ pick 3-5 random cards

                for card in random_cards:
                    UserCollection.objects.create(
                        user=user,
                        card_id=card['id'],
                        card_name=card['name'],
                        card_image_url=card['images']['small']
                    )

            else:
                print("Failed to fetch Pokémon cards")

        except Exception as e:
            print("Error fetching or assigning Pokémon:", e)

class UserProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['user_id'] = user.id
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user_id'] = self.user.id  # Add user ID to login response
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
