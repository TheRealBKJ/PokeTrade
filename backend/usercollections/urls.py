from django.urls import path
from .views import UserCollectionListCreateView
from .views import BrowseAllCollectionsView

urlpatterns = [
    path('', UserCollectionListCreateView.as_view(), name='user-collection'),
    path('all/', BrowseAllCollectionsView.as_view(), name='browse-collections'),
]
