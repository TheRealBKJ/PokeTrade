from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Challenge, UserChallenge
from .serializers import UserChallengeSerializer
from profiles.models import Profile  # Assuming you have profile with currency_balance

class DailyChallengesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        # Make sure challenges exist for the user
        daily_challenges = UserChallenge.objects.filter(user=user)

        if not daily_challenges.exists():
            # Assign daily challenges
            default_challenges = Challenge.objects.all()[:3]  # First 3 challenges
            for challenge in default_challenges:
                UserChallenge.objects.create(user=user, challenge=challenge)

            daily_challenges = UserChallenge.objects.filter(user=user)

        serializer = UserChallengeSerializer(daily_challenges, many=True)
        return Response(serializer.data)

class ClaimChallengeRewardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, challenge_id):
        try:
            user_challenge = UserChallenge.objects.get(user=request.user, challenge_id=challenge_id)

            if not user_challenge.completed:
                return Response({'error': 'Challenge not completed yet!'}, status=400)

            if user_challenge.claimed:
                return Response({'error': 'Reward already claimed!'}, status=400)

            # Give currency
            profile = request.user.profile
            profile.currency_balance += user_challenge.challenge.reward_amount
            profile.save()

            user_challenge.claimed = True
            user_challenge.save()

            return Response({'message': 'Reward claimed successfully!', 'new_balance': profile.currency_balance})
        except UserChallenge.DoesNotExist:
            return Response({'error': 'Challenge not found.'}, status=404)
