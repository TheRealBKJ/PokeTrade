from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # All API under /api/
    path('api/', include('api.urls')),

    # User endpoints
    path('api/users/',          include('users.urls')),
    path('api/usercollections/',include('usercollections.urls')),
    path('api/marketplace/',    include('marketplace.urls')),
    path('api/notifications/',  include('notifications.urls')),
    path('api/trades/',         include('trades.urls')),
    path('api/profiles/',       include('profiles.urls')),
    path('api/challenges/',     include('challenges.urls')),
    path('api/messages/',       include('messaging.urls')),
]
