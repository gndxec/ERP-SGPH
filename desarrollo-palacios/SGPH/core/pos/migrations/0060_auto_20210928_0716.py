# Generated by Django 2.2.12 on 2021-09-28 14:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0059_auto_20210924_1302'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='referencia',
            field=models.CharField(default=1, max_length=150, unique=True, verbose_name='Referencia'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='product',
            name='codigo',
            field=models.CharField(max_length=150, unique=True, verbose_name='Código'),
        ),
    ]
