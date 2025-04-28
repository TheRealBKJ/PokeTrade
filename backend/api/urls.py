# backend/api/urls.py

from django.urls import path
from .views import ChatBotView

# (optional) namespacing if you ever want to reverse('api:chatbot')
app_name = 'api'

urlpatterns = [
    # POST http://<host>/api/chatbot/ → ChatBotView.post()
    path('', ChatBotView.as_view(), name='chatbot'),
]
