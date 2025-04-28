# /Users/dobromiriliev/PycharmProjects/PokeTrade/backend/chatbot/urls.py

from django.urls import path
# Import the RENAMED view function from views.py
from .views import generalized_chatbot_recommender

urlpatterns = [
    # Make sure the path uses the new view name as well
    path('recommend/', generalized_chatbot_recommender, name='chatbot_recommend'),
    # If you had other paths related to the old view, update them too or remove them.
]