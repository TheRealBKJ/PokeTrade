from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import random
import requests
from usercollections.models import UserCollection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'currency_balance': user.profile.currency_balance,
        })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def claim_daily_pack(request):
    try:
        response = requests.get('https://api.pokemontcg.io/v2/cards?pageSize=250')
        if response.status_code == 200:
            cards = response.json()['data']
            random_card = random.choice(cards)
            UserCollection.objects.create(
                user=request.user,
                card_id=random_card['id'],
                card_name=random_card['name'],
                card_image_url=random_card['images']['small']
            )
            request.user.profile.currency_balance += 50  # 💰 reward coins too
            request.user.profile.save()
            return Response({'message': 'Daily pack claimed!', 'new_card': random_card['name']})
        else:
            return Response({'error': 'Failed to fetch Pokémon cards'}, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=500)