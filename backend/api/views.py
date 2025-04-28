from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ChatBotView(APIView):
    def post(self, request):
        user_input = request.data.get('message')
        user_id = request.data.get('userID')

        if not user_input or not user_id:
            return Response({"error": "Missing message or userID."}, status=status.HTTP_400_BAD_REQUEST)

        print(f"[Chatbot] Received from user {user_id}: {user_input}")

        # Simple bot logic
        if "hello" in user_input.lower():
            reply = "Hello! How can I assist you today?"
        else:
            reply = f"User {user_id}, you said: {user_input}"

        return Response({"response": reply})
