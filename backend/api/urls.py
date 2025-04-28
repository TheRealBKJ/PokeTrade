from django.urls import path
from .views import ChatBotView

urlpatterns = [
    path('', ChatBotView.as_view(), name='chatbot'),
]
