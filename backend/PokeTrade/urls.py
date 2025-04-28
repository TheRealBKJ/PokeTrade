# backend/PokeTrade/urls.py

from django.contrib import admin
from django.urls import path, include
from .views import homepage
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Admin and homepage
    path('admin/', admin.site.urls),
    path('', homepage, name='homepage'),

    # JWT login & refresh
    path('api/token/',         TokenObtainPairView.as_view(),   name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(),     name='token_refresh'),

    # User endpoints (register & profile)
    path('api/users/', include('users.urls')),

    # Chatbot endpoint
    path('api/chatbot/', include('api.urls')),

    # Other app endpoints
    path('api/usercollections/', include('usercollections.urls')),
    path('api/marketplace/',      include('marketplace.urls')),
    path('api/notifications/',    include('notifications.urls')),
    path('api/trades/',           include('trades.urls')),
    path('api/profiles/',         include('profiles.urls')),
    path('api/challenges/',       include('challenges.urls')),
    path('api/messages/',         include('messaging.urls')),
]
