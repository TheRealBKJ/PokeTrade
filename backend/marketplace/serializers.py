from rest_framework import serializers
from .models import Listing, ListingBid

class BidSerializer(serializers.ModelSerializer):
    bidder_username = serializers.CharField(source='bidder.username', read_only=True)

    class Meta:
        model  = ListingBid
        fields = ['id','bidder','bidder_username','amount','placed_at']
        read_only_fields = ['id','bidder','bidder_username','placed_at']

class ListingSerializer(serializers.ModelSerializer):
    bids = BidSerializer(many=True, read_only=True)

    class Meta:
        model  = Listing
        fields = [
            'id','owner','card_id','card_name','card_image_url',
            'is_auction','starting_price','current_price','end_time',
            'bids'
        ]
        read_only_fields = ['id','owner','current_price','bids']
