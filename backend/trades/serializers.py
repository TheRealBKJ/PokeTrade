from rest_framework import serializers
from .models import Trade

class TradeSerializer(serializers.ModelSerializer):
    trader_username    = serializers.CharField(source='trader.username',    read_only=True)
    recipient           = serializers.PrimaryKeyRelatedField(read_only=True)
    recipient_username = serializers.CharField(source='recipient.username', read_only=True)

    class Meta:
        model  = Trade
        fields = [
            'id',
            'trader',
            'trader_username',
            'recipient',
            'recipient_username',
            'offered_card_id',
            'requested_card_id',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'trader',
            'trader_username',
            'recipient',
            'recipient_username',
            'status',
            'created_at',
            'updated_at',
        ]
