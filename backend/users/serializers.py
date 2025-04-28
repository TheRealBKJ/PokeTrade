from rest_framework import serializers
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    # your React app will pass its URL so we can build the link
    frontend_url = serializers.URLField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()             # urlsafe_base64 from the link
    token = serializers.CharField()           # password-reset token
    new_password = serializers.CharField(
        min_length=8, write_only=True
    )