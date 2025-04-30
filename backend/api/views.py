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
    No auth required; if you send “recommend trade” it returns
    two random Pokémon cards. Otherwise it just echoes.
    """
    authentication_classes = []    # disable DRF auth
    permission_classes = [AllowAny]

    # intent-response mapping for simple Q&A
    INTENT_RESPONSES = {
        'trade': [
            "Sure, {username}! To trade cards, go to the Marketplace page and propose a new offer.",
            "{username}, check out the Marketplace: you can browse listings and send trade requests there."
        ],
        'profile': [
            "{username}, your profile page (/profile) shows your currency balance and collected cards.",
            "You can view your stats anytime at /profile, {username}."
        ],
        'daily pack': [
            "To claim your daily pack, hit the “Claim Daily Pack” button on your profile page, {username}.",
            "{username}, just visit /profile and tap “Claim Daily Pack” to get your reward."
        ],
        'challenges': [
            "{username}, head over to /daily-challenges for today’s missions and rewards!",
            "Your daily challenges live at /daily-challenges — complete them to earn prizes, {username}."
        ],
        'notifications': [
            "Check /notifications to see your latest alerts, {username}.",
            "{username}, any new notifications will appear on the Notifications page."
        ],
        'help': [
            "How can I help you next, {username}? Ask me about trading, daily packs, or anything else.",
            "{username}, I’m here to help—try asking about profile, notifications, or challenges."
        ]
    }

    FALLBACKS = [
        "{username}, I’m not sure I got that. Could you rephrase?",
        "{username}, sorry, I didn’t understand. Want to try asking in a different way?"
    ]

    def post(self, request, *args, **kwargs):
        user_msg = request.data.get('message', '').strip()
        text = user_msg.lower()
        user = request.user
        username = user.username if getattr(user, "is_authenticated", False) else "Trainer"

        # 1) intent matching by keyword
        for intent, templates in self.INTENT_RESPONSES.items():
            if intent in text:
                reply = random.choice(templates).format(username=username)
                return Response({"response": reply}, status=status.HTTP_200_OK)

        # 2) greetings override
        if any(g in text for g in ["hi", "hello", "hey"]):
            greeting = random.choice(["Hello", "Hi", "Hey"])
            return Response(
                {"response": f"{greeting}, {username}! How can I help you today?"},
                status=status.HTTP_200_OK
            )

        # 3) empty message
        if not text:
            return Response(
                {"response": f"Hey {username}, I didn’t catch that—could you say it again?"},
                status=status.HTTP_200_OK
            )

        # 4) fallback
        reply = random.choice(self.FALLBACKS).format(username=username)
        return Response({"response": reply}, status=status.HTTP_200_OK)
