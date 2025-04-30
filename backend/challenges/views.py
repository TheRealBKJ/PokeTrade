from datetime import date
import random

from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import ChallengeTemplate, UserChallenge
from .serializers import UserChallengeSerializer

class DailyChallengesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET /api/challenges/daily/
        - If the user has no challenges for today, generate them.
        - Return list of UserChallenge for today.
        """
        user = request.user
        today = date.today()

        # Ensure there are templates for today:
        templates = ChallengeTemplate.objects.filter(date=today)
        if not templates.exists():
            # (Optional) Auto-create a few templates if none exist:
            samples = [
                {
                    'name': 'Make 3 Trades',
                    'description': 'Complete three successful trades today.',
                    'reward': 15,
                },
                {
                    'name': 'Claim Daily Pack',
                    'description': 'Remember to claim your daily pack for bonus cards.',
                    'reward': 5,
                },
                {
                    'name': 'Check Notifications',
                    'description': 'View all your notifications at least once.',
                    'reward': 5,
                },
            ]
            for s in samples:
                ChallengeTemplate.objects.create(
                    date=today,
                    name=s['name'],
                    description=s['description'],
                    reward=s['reward']
                )
            templates = ChallengeTemplate.objects.filter(date=today)

        # Ensure the user has a UserChallenge for each template:
        for tpl in templates:
            UserChallenge.objects.get_or_create(user=user, challenge=tpl)

        queryset = UserChallenge.objects.filter(user=user, challenge__date=today)
        serializer = UserChallengeSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def claim_challenge(request, pk):
    """
    POST /api/challenges/claim/<pk>/
    Mark a single challenge as claimed (if completed), add reward to profile.
    """
    user = request.user
    uc = get_object_or_404(UserChallenge, pk=pk, user=user)

    if not uc.completed:
        return Response(
            {'error': 'Challenge not yet completed.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    if uc.claimed:
        return Response(
            {'error': 'Challenge already claimed.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Award the reward
    profile = user.profile
    profile.currency_balance += uc.challenge.reward
    profile.save()

    uc.claimed = True
    uc.save()

    return Response(
        {'message': f'Challenge "{uc.challenge.name}" claimed! +{uc.challenge.reward} coins'},
        status=status.HTTP_200_OK
    )
