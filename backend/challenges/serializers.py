from rest_framework import serializers
from .models import UserChallenge

class UserChallengeSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='challenge.name', read_only=True)
    description = serializers.CharField(source='challenge.description', read_only=True)
    reward = serializers.IntegerField(source='challenge.reward', read_only=True)

    class Meta:
        model = UserChallenge
        fields = [
            'id',
            'name',
            'description',
            'reward',
            'completed',
            'claimed',
        ]
