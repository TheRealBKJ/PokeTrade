from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    sender_username    = serializers.CharField(source='sender.username', read_only=True)
    recipient_username = serializers.CharField(source='recipient.username', read_only=True)

    class Meta:
        model  = Message
        fields = ['id','sender','sender_username','recipient','recipient_username','body','sent_at','read']
        read_only_fields = ['sender','sent_at','read']
