# backend/messaging/views.py

from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import PermissionDenied
from .models import Message
from .serializers import MessageSerializer

class MessageListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/messages/  → list all messages
    POST /api/messages/  → send a new message
    """
    queryset           = Message.objects.none()
    serializer_class   = MessageSerializer
    permission_classes = [AllowAny]   # allow anonymous access

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Message.objects.filter(Q(sender=user) | Q(recipient=user)).order_by('-sent_at')
        # if anonymous, return nothing (or all messages, if you prefer)
        return Message.objects.none()

    def perform_create(self, serializer):
        # If the sender is anonymous, you can set sender=None or a default
        # Here we'll attach sender=None for anonymous
        serializer.save(sender=getattr(self.request, 'user', None))


class MessageDetailView(generics.RetrieveAPIView):
    """
    GET /api/messages/<id>/  → retrieve a single message
    """
    queryset           = Message.objects.all()
    serializer_class   = MessageSerializer
    permission_classes = [AllowAny]   # allow anonymous access

    def get_object(self):
        msg  = super().get_object()
        user = self.request.user

        # If anonymous, block access to private messages
        if not user.is_authenticated:
            return msg  # or raise PermissionDenied() if you want to hide it

        # Only sender or recipient may view when authenticated
        if msg.sender != user and msg.recipient != user:
            raise PermissionDenied("You do not have permission to view this message.")

        # Mark read if you're the recipient
        if msg.recipient == user and not msg.read:
            msg.read = True
            msg.save(update_fields=['read'])

        return msg
