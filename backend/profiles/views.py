from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from django.utils import timezone
from datetime import timedelta
import requests, random

# No more UserCollection import
# from usercollections.models import UserCollection

class ProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        profile = request.user.profile
        return Response({
            'username': request.user.username,
            'currency_balance': profile.currency_balance,
            # omit cards_count if you’re not pulling from UserCollection
        })

@api_view(['POST'])
@permission_classes([AllowAny])
def claim_daily_pack(request):
    profile = request.user.profile
    now = timezone.now()

    # enforce 24-hour cooldown
    if profile.last_claimed and now - profile.last_claimed < timedelta(hours=24):
        return Response(
            {'error': 'Already claimed today'},
            status=403
        )

    # fetch a random card from the Pokémon TCG API
    response = requests.get(
        'https://api.pokemontcg.io/v2/cards?pageSize=250'
    )
    if response.status_code != 200:
        return Response(
            {'error': 'Failed to fetch Pokémon cards'},
            status=400
        )

    random_card = random.choice(response.json()['data'])

    # update the Profile only (no UserCollection)
    profile.currency_balance += 50
    profile.last_claimed = now
    profile.save()

    return Response({
        'message': 'Daily pack claimed!',
        'new_card': random_card['name']
    })
