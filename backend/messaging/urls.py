from django.urls import path
from .views import MessageListCreateView, MessageDetailView

urlpatterns = [
    # GET  /api/messages/      → list user’s messages or threads
    # POST /api/messages/      → send a new message
    path('', MessageListCreateView.as_view(), name='messages-list'),

    # GET  /api/messages/<id>/ → retrieve a single message (mark as read)
    path('<int:pk>/', MessageDetailView.as_view(), name='message-detail'),
]
