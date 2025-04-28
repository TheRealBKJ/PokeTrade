from django.urls import path
from .views import MessageListCreateView, MessageDetailView

urlpatterns = [
    path('',    MessageListCreateView.as_view(), name='messages-list'),
    path('<int:pk>/', MessageDetailView.as_view(), name='message-detail'),
]
