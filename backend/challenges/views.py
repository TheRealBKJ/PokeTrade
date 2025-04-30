# backend/challenges/views.py
from datetime import date
import random

from django.apps import apps
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import ChallengeTemplate, UserChallenge
from .serializers import UserChallengeSerializer

class DailyChallengesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = date.today()

        # 1) Ensure we have templates for today
        templates = ChallengeTemplate.objects.filter(date=today)
        if not templates.exists():
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
                ChallengeTemplate.objects.create(date=today, **s)
            templates = ChallengeTemplate.objects.filter(date=today)

        # 2) Ensure each template has a UserChallenge
        for tpl in templates:
            UserChallenge.objects.get_or_create(user=user, challenge=tpl)

        # 3) Return only incomplete & unclaimed challenges
        queryset = UserChallenge.objects.filter(
            user=user,
            challenge__date=today,
            completed=False,
            claimed=False
        )
        serializer = UserChallengeSerializer(queryset, many=True)
        return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def complete_challenge(request, pk):
    """
    PATCH /api/challenges/complete/<pk>/
    Mark challenge complete → award coins → spawn new one + notify.
    """
    user = request.user
    uc = get_object_or_404(UserChallenge, pk=pk, user=user)

    if uc.completed:
        return Response({'error': 'Already completed.'},
                        status=status.HTTP_400_BAD_REQUEST)

    # 1) Mark as completed
    uc.completed = True
    uc.save()

    # 2) Award coins
    profile = user.profile
    reward = uc.challenge.reward
    profile.currency_balance += reward
    profile.save()

    # 3) Spawn a new challenge if any remain
    today = date.today()
    assigned_ids = UserChallenge.objects.filter(
        user=user,
        challenge__date=today
    ).values_list('challenge__id', flat=True)

    available = ChallengeTemplate.objects.filter(date=today) \
                  .exclude(id__in=assigned_ids)
    if available.exists():
        new_tpl = random.choice(list(available))
        UserChallenge.objects.create(user=user, challenge=new_tpl)

        # 4) Create a Notification via dynamic import
        Notification = apps.get_model('notifications', 'Notification')
        Notification.objects.create(
            user=user,
            message=f"New daily challenge available: {new_tpl.name}"
        )

    return Response({
        'message': f'Challenge marked complete! You earned +{reward} 🪙',
        'new_balance': profile.currency_balance
    }, status=status.HTTP_200_OK)
