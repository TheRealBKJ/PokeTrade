# backend/api/views.py
import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

class ChatBotView(APIView):
    permission_classes = [AllowAny]

    # map “intents” → lists of reply templates (you can expand these)
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

    # default fallbacks when no intent matches
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
            reply = f"{greeting}, {username}! How can I help you today?"
            return Response({"response": reply}, status=status.HTTP_200_OK)

        # 3) empty message
        if not text:
            reply = f"Hey {username}, I didn’t catch that—could you say it again?"
            return Response({"response": reply}, status=status.HTTP_200_OK)

        # 4) fallback
        reply = random.choice(self.FALLBACKS).format(username=username)
        return Response({"response": reply}, status=status.HTTP_200_OK)
