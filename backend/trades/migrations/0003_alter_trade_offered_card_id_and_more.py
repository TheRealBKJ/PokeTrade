# Generated by Django 5.1.5 on 2025-04-30 13:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trades', '0002_alter_trade_offered_card_id_alter_trade_recipient_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trade',
            name='offered_card_id',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='trade',
            name='requested_card_id',
            field=models.CharField(max_length=50),
        ),
    ]
