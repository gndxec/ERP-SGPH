# Generated by Django 2.2.12 on 2021-09-07 16:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0005_sucursal'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='codigo',
            field=models.CharField(default=1, max_length=150, verbose_name='Código'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='product',
            name='serie',
            field=models.CharField(default=1, max_length=150, verbose_name='Serie'),
            preserve_default=False,
        ),
    ]