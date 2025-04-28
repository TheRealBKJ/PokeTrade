from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes


@api_view(['POST'])
@permission_classes([AllowAny])
def chatbot_response(request):
    user_message = request.data.get('message')

    # Basic fake recommendation logic (for now)
    if "fire" in user_message.lower():
        bot_reply = "I recommend trading for Charizard cards!"
    else:
        bot_reply = "Tell me what type of Pokémon you like!"

    return Response({"response": bot_reply})
