from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

api_patterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', include('users.urls')),
    path('chatbot/', include('api.urls')),
    path('usercollections/', include('usercollections.urls')),
    path('marketplace/', include('marketplace.urls')),
    path('notifications/', include('notifications.urls')),
    path('trades/', include('trades.urls')),
    path('profiles/', include('profiles.urls')),
    path('challenges/', include('challenges.urls')),
    path('messages/', include('messaging.urls')),
    path('auctions/', include('auctions.urls'))
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include((api_patterns, 'api'), namespace='api')),
    path('', TemplateView.as_view(template_name='index.html'), name='homepage'),
]
