from django.urls import path
from .views import NotificationListCreateView


urlpatterns = [
    path('', NotificationListCreateView.as_view(), name='notifications'),
]
