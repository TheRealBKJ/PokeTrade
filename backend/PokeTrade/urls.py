# backend/PokeTrade/urls.py

from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# all of your API routes live under /api/
api_patterns = [
    # JWT login & refresh
    path('token/',         TokenObtainPairView.as_view(),   name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(),     name='token_refresh'),

    # User endpoints (register, login, profile, etc.)
    path('users/',         include('users.urls')),

    # Chatbot endpoint
    path('chatbot/',       include('api.urls')),

    # Other app endpoints
    path('usercollections/', include('usercollections.urls')),
    path('marketplace/',      include('marketplace.urls')),
    path('notifications/',    include('notifications.urls')),
    path('trades/',           include('trades.urls')),
    path('profiles/',         include('profiles.urls')),
    path('challenges/',       include('challenges.urls')),
    path('messages/',         include('messaging.urls')),
]

urlpatterns = [
    # Django admin
    path('admin/', admin.site.urls),

    # Everything under /api/
    path('api/', include((api_patterns, 'api'), namespace='api')),

    # Root → serve your SPA's index.html (or point at a Django homepage view)
    path('', TemplateView.as_view(template_name='index.html'), name='homepage'),
]
