# api/urls.py
from django.urls import path
from . import views # Make sure to import your api views

urlpatterns = [
    # Example: Handles requests to '/api/'
    path('', views.api_root_view, name='api_root'),

    # Add other API endpoints, e.g.:
    # path('pokemon/', views.pokemon_list_view, name='pokemon_list'),
    # path('pokemon/<int:pk>/', views.pokemon_detail_view, name='pokemon_detail'),
    # path('trades/', views.api_trade_list_view, name='api_trade_list'),
]