# Generated by Django 2.2.12 on 2021-09-16 14:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0036_remove_purchaserequest_subtotaltres'),
    ]

    operations = [
        migrations.AddField(
            model_name='purchaserequest',
            name='total',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=9),
        ),
    ]