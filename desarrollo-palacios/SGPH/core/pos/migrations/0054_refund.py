# Generated by Django 2.2.12 on 2021-09-24 18:22

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0053_auto_20210918_1511'),
    ]

    operations = [
        migrations.CreateModel(
            name='Refund',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fechaOrigen', models.DateField(default=datetime.datetime.now, verbose_name='Fecha de Creación ')),
                ('fechaIngreso', models.DateField(default=datetime.datetime.now, verbose_name='Fecha de Ingreso de Mercadería ')),
                ('cant', models.IntegerField(default=0, verbose_name='Cantidad')),
                ('serie', models.CharField(max_length=150, verbose_name='Serie')),
                ('motivo', models.CharField(blank=True, max_length=200, null=True, verbose_name='Motivo')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pos.Product')),
                ('provider', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pos.Provider')),
                ('sucursal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pos.Sucursal')),
            ],
            options={
                'verbose_name': 'Refund',
                'verbose_name_plural': 'Refund',
                'ordering': ['id'],
            },
        ),
    ]