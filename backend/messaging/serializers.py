# backend/messaging/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Message

User = get_user_model()

class MessageSerializer(serializers.ModelSerializer):
    sender_username    = serializers.ReadOnlyField(source='sender.username')
    recipient          = serializers.CharField(write_only=True)
    recipient_username = serializers.ReadOnlyField(source='recipient.username')

    class Meta:
        model = Message
        fields = [
            'id',
            'sender_username',
            'recipient',
            'recipient_username',
            'body',
            'sent_at',
            'read',
        ]
        read_only_fields = ['id','sender_username','recipient_username','sent_at','read']

    def validate_recipient(self, value):
        try:
            return User.objects.get(username=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("Recipient user does not exist.")

    def create(self, validated_data):
        sender    = validated_data.pop('sender')
        recipient = validated_data.pop('recipient')
        return Message.objects.create(
            sender=sender,
            recipient=recipient,
            **validated_data
        )
