from rest_framework import serializers
from .models import UserCollection

class UserCollectionSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)  # 🔥 Add this line

    class Meta:
        model = UserCollection
        fields = ['id', 'user', 'card_id', 'card_name', 'card_image_url', 'is_listed']
