"""
URL configuration for PokeTrade project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# PokeTrade/urls.py
"""
URL configuration for PokeTrade project.
"""
from django.contrib import admin
from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from users.views import RegisterView

urlpatterns = [
    path('admin/', admin.site.urls),
    # Auth endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # refresh token
    path('api/register/', RegisterView.as_view(), name='register'),  # register user

    path('', views.homepage, name='homepage'),

    path('api/', include('api.urls')),
    path('marketplace/', include('marketplace.urls')),
    path('notifications/', include('notifications.urls')),
    path('trades/', include('trades.urls')),
    path('api/users/', include('users.urls')), 

    path('usercollections/', include('usercollections.urls')),
    path('api/chatbot/', include('chatbot.urls')),
    path('api/profile/', include('profiles.urls')),
    path('api/challenges/', include('challenges.urls')),

]