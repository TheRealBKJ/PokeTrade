# backend/marketplace/apps.py

from django.apps import AppConfig

class MarketplaceConfig(AppConfig):
    name = 'marketplace'
    verbose_name = "Marketplace"

    def ready(self):
        # Run after every migrate; guards prevent duplicates or DB‐not‐ready errors.
        from django.db.models.signals import post_migrate
        from django.contrib.auth import get_user_model
        from django.db.utils import OperationalError, ProgrammingError
        from .models import Listing

        def create_default_auctions(sender, **kwargs):
            try:
                # If any auction exists, do nothing
                if Listing.objects.filter(is_auction=True).exists():
                    return

                User = get_user_model()
                # Use your admin/superuser as the owner
                admin = User.objects.filter(is_superuser=True).first()
                if not admin:
                    return

                # (card_id, card_name, image_url, starting_price, duration_hours)
                samples = [
                    ("base1-1", "Alakazam",    "https://images.pokemontcg.io/base1/1.png",   50, 24),
                    ("base3-1", "Aerodactyl",  "https://images.pokemontcg.io/base3/1.png",   30, 48),
                    ("xy2-6",   "Nuzleaf",     "https://images.pokemontcg.io/xy2/6.png",     20, 72),
                ]

                for cid, name, url, price, hours in samples:
                    lst = Listing.objects.create(
                        owner=admin,
                        card_id=cid,
                        card_name=name,
                        card_image_url=url,
                    )
                    # set starting price then start auction for X hours
                    lst.starting_price = price
                    lst.start_auction(hours=hours)
                    lst.save()

            except (OperationalError, ProgrammingError):
                # DB tables not ready yet, bail silently
                return

        post_migrate.connect(
            create_default_auctions,
            dispatch_uid="marketplace_create_default_auctions"
        )
