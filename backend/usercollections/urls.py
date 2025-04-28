from django.urls import path
from .views import (
    UserCollectionListCreateView,
    BrowseAllCollectionsView,
    SellPokemonView,
)

urlpatterns = [
    path('', UserCollectionListCreateView.as_view(), name='user-collection'),
    path('all/', BrowseAllCollectionsView.as_view(), name='browse-collections'),
    path('<int:pk>/sell/', SellPokemonView.as_view(), name='sell-pokemon'),
]
