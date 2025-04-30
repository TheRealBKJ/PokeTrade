# backend/profiles/views.py

import random
import requests
from datetime import timedelta
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from usercollections.models import UserCollection  # only if you still need it here

class ProfileView(APIView):
    """
    GET /api/profiles/
    Returns the logged-in user’s profile info.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.profile
        cards_count = UserCollection.objects.filter(user=request.user).count()
        return Response({
            "username": request.user.username,
            "currency_balance": profile.currency_balance,
            "cards_count": cards_count
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def claim_daily_pack(request):
    """
    POST /api/profiles/daily-pack/
    Enforces 24h cooldown, fetches a random TCG card,
    awards coins, and returns the new card + updated stats.
    """
    profile = request.user.profile
    now = timezone.now()

    # 1) Cooldown check
    if profile.last_claimed and (now - profile.last_claimed) < timedelta(hours=24):
        return Response(
            {"error": "You have already claimed today."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 2) Fetch a batch of cards from the TCG API
    api_res = requests.get('https://api.pokemontcg.io/v2/cards?pageSize=250')
    if api_res.status_code != 200:
        return Response(
            {"error": "Failed to fetch cards."},
            status=status.HTTP_502_BAD_GATEWAY
        )
    cards = api_res.json().get('data', [])
    if not cards:
        return Response(
            {"error": "No cards available."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # 3) Pick one at random and save to collection
    chosen = random.choice(cards)
    uc = UserCollection.objects.create(
        user=request.user,
        card_id=chosen['id'],
        card_name=chosen['name'],
        card_image_url=chosen['images']['small']
    )

    # 4) Award coins and update last_claimed
    reward = 50
    profile.currency_balance += reward
    profile.last_claimed = now
    profile.save()

    # 5) Return result
    new_count = UserCollection.objects.filter(user=request.user).count()
    return Response({
        "message": "Daily pack claimed!",
        "new_card": {
            "id": uc.pk,
            "card_id": uc.card_id,
            "card_name": uc.card_name,
            "card_image_url": uc.card_image_url
        },
        "new_balance": profile.currency_balance,
        "cards_count": new_count
    }, status=status.HTTP_200_OK)
