from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Message
from .serializers import MessageSerializer
from django.db import models

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class   = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            models.Q(sender=user) | models.Q(recipient=user)
        ).order_by('-sent_at')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class MessageDetailView(generics.RetrieveAPIView):
    queryset           = Message.objects.all()
    serializer_class   = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        msg = super().get_object()
        user = self.request.user
        if msg.sender != user and msg.recipient != user:
            raise PermissionDenied()
        if msg.recipient == user and not msg.read:
            msg.read = True
            msg.save(update_fields=['read'])
        return msg
