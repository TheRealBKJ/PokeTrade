from django.urls import path
from .views import (
    RegisterView,
    UserProfileView,
    CustomTokenObtainPairView,
)

urlpatterns = [
    # POST /api/users/register/       → create new account
    path('register/', RegisterView.as_view(), name='register'),

    # POST /api/users/token/          → obtain JWT (login)
    path('token/',    CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # GET  /api/users/profile/        → retrieve current user (requires auth)
    path('profile/',  UserProfileView.as_view(),       name='profile'),
]
