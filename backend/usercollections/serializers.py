from rest_framework import serializers
from .models import UserCollection

class UserCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCollection
        fields = '__all__'
