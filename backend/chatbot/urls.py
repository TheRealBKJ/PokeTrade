from django.urls import path
from .views import chatbot_response

urlpatterns = [
    path('chat/', chatbot_response),
]
