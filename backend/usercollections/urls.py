from django.urls import path
from .views import UserCollectionListCreateView

urlpatterns = [
    path('', UserCollectionListCreateView.as_view(), name='user-collection'),
]
