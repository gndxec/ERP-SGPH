# Generated by Django 2.2.12 on 2021-09-24 19:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0056_mark'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mark',
            name='descripcion',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Descripción'),
        ),
        migrations.AlterField(
            model_name='mark',
            name='marca',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Marca'),
        ),
    ]