# Generated by Django 2.2.12 on 2021-09-08 15:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0010_auto_20210908_0825'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='quotationsaledetail',
            name='product',
        ),
        migrations.RemoveField(
            model_name='quotationsaledetail',
            name='sale',
        ),
        migrations.DeleteModel(
            name='QuotationSale',
        ),
        migrations.DeleteModel(
            name='QuotationSaleDetail',
        ),
    ]