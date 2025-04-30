# backend/api/views.py

import random
import requests
from django.utils import timezone
from datetime import timedelta

from rest_framework.views import APIView
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status


class ProfileView(APIView):
    """
    GET /api/profiles/
    Returns the user's username and currency balance.
    (No auth required)
    """
    authentication_classes = []       # disable DRF auth
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        profile = request.user.profile
        return Response({
            "username": request.user.username,
            "currency_balance": profile.currency_balance,
        })


@api_view(['POST'])
@authentication_classes([])  # disable DRF auth
@permission_classes([AllowAny])
def claim_daily_pack(request):
    """
    POST /api/profiles/daily-pack/
    Enforces a 24h cooldown, fetches a random TCG card,
    updates the user's balance + last_claimed, and returns the card.
    """
    profile = request.user.profile
    now = timezone.now()

    # 1) 24h cooldown check
    if profile.last_claimed and now - profile.last_claimed < timedelta(hours=24):
        return Response(
            {"error": "You have already claimed today."},
            status=status.HTTP_403_FORBIDDEN
        )

    # 2) Pull a batch of cards
    api_res = requests.get('https://api.pokemontcg.io/v2/cards?pageSize=250')
    if api_res.status_code != 200:
        return Response(
            {"error": "Failed to fetch Pokémon cards."},
            status=status.HTTP_502_BAD_GATEWAY
        )

    cards = api_res.json().get('data', [])
    if not cards:
        return Response(
            {"error": "No cards available."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # 3) Pick one at random
    card = random.choice(cards)

    # 4) Award coins and update last_claimed
    reward = 50
    profile.currency_balance += reward
    profile.last_claimed = now
    profile.save()

    # 5) Return the new card + updated balance
    return Response({
        "message": "Daily pack claimed!",
        "card": {
            "id": card["id"],
            "name": card["name"],
            "image_url": card["images"]["small"]
        },
        "new_balance": profile.currency_balance
    })


@api_view(['GET'])
@authentication_classes([])  # disable DRF auth
@permission_classes([AllowAny])
def trading_recommendation(request):
    """
    GET /api/trading/recommendation/
    Fetches two random Pokémon cards and returns them as a “trade recommendation.”
    """
    api_res = requests.get('https://api.pokemontcg.io/v2/cards?pageSize=250')
    if api_res.status_code != 200:
        return Response(
            {"error": "Failed to fetch Pokémon cards."},
            status=status.HTTP_502_BAD_GATEWAY
        )

    cards = api_res.json().get('data', [])
    if len(cards) < 2:
        return Response(
            {"error": "Not enough cards available."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    card1, card2 = random.sample(cards, 2)
    return Response({
        "recommendation": [
            {"id": card1["id"], "name": card1["name"], "image_url": card1["images"]["small"]},
            {"id": card2["id"], "name": card2["name"], "image_url": card2["images"]["small"]},
        ]
    })


class ChatbotView(APIView):
    """
    POST /api/chatbot/
    - “HOW TO TRADE” intent returns instructions.
    - “WHAT TO TRADE” intent returns two random placeholder Pokémon as a single string.
    - Greetings and fallback responses.
    """
    authentication_classes = []  # no auth required
    permission_classes = [AllowAny]

    POKEMON_PLACEHOLDERS = [
        "Pikachu", "Charizard", "Bulbasaur", "Squirtle",
        "Eevee", "Snorlax", "Gengar", "Mewtwo", "Lapras"
    ]

    HOW_TO_TRADE_RESPONSES = [
        "To trade cards, go to the Marketplace and click “Propose Trade.”",
        "Head to the Marketplace, select an offer, then hit “Send Trade Request.”"
    ]

    FALLBACK_RESPONSE = "Sorry, I didn't understand that. Try asking “how to trade” or “what to trade.”"

    def post(self, request, *args, **kwargs):
        msg = (request.data.get("message") or "").strip().lower()

        # 1) HOW TO TRADE intent
        if "how to trade" in msg or "tell me how to trade" in msg:
            return Response({"response": random.choice(self.HOW_TO_TRADE_RESPONSES)})

        # 2) WHAT TO TRADE intent
        if any(phrase in msg for phrase in [
            "what to trade", "what should i trade",
            "recommend trade", "give me two pokemon"
        ]):
            c1, c2 = random.sample(self.POKEMON_PLACEHOLDERS, 2)
            return Response({"response": f"{c1} and {c2}"})

        # 3) Greetings
        if any(g in msg for g in ["hi", "hello", "hey"]):
            return Response({"response": "Hello! How can I help you today?"})

        # 4) Fallback
        return Response({"response": self.FALLBACK_RESPONSE})
