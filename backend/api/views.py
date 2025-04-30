# backend/api/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated

class ChatBotView(APIView):
    # allow public access (or change to IsAuthenticated if you want)
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        user_msg = request.data.get('message', '').strip()
        user_id  = request.data.get('userID', 'unknown')
        username = request.user.username

        # simple rule-based replies
        text = user_msg.lower()
        if not user_msg:
            bot_reply = "🤖 I didn’t catch that—could you say it again?"
        elif any(greet in text for greet in ['hi', 'hello', 'hey']):
            bot_reply = (
                f"🐾 Hello, Trainer {username}! "
                "I’m your PokéTrade Assistant—how can I help you today?"
            )
        elif 'help' in text or 'website' in text:
            bot_reply = (
                "🛠️ Sure—what part of the PokeTrade website do you need help with? "
                "(e.g. login, profile display, chatbot integration, styling.)"
            )
        elif 'login' in text:
            bot_reply = (
                "🔑 To fix login: make sure your React front end uses our "
                "`api` Axios instance pointed at `/api/token/` and sets "
                "`Authorization: Bearer <token>` afterward. Need sample code?"
            )
        else:
            bot_reply = (
                "🤔 Interesting question! Could you give me a bit more detail "
                "about what you’d like to do?"
            )

        return Response({'response': bot_reply}, status=status.HTTP_200_OK)
