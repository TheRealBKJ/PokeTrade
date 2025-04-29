from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
import requests, random
from usercollections.models import UserCollection

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def claim_daily_pack(request):
    profile = request.user.profile
    now = timezone.now()

    if profile.last_claimed and now - profile.last_claimed < timedelta(hours=24):
        return Response({'error': 'Already claimed today'}, status=403)

    response = requests.get('https://api.pokemontcg.io/v2/cards?pageSize=250')
    if response.status_code != 200:
        return Response({'error': 'Failed to fetch Pokémon cards'}, status=400)

    random_card = random.choice(response.json()['data'])
    UserCollection.objects.create(
        user=request.user,
        card_id=random_card['id'],
        card_name=random_card['name'],
        card_image_url=random_card['images']['small']
    )
    profile.currency_balance += 50
    profile.last_claimed = now
    profile.save()

    return Response({'message': 'Daily pack claimed!', 'new_card': random_card['name']})
