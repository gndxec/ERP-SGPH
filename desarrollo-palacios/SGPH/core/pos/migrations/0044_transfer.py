# Generated by Django 2.2.12 on 2021-09-18 19:03

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0043_auto_20210918_0854'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transfer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Contacto', models.CharField(max_length=150, verbose_name='Responsable de envio')),
                ('fechaSalida', models.DateField(default=datetime.datetime.now, verbose_name='Fecha de Salida ')),
                ('fechaPrevista', models.DateField(default=datetime.datetime.now, verbose_name='Fecha de Llegada')),
                ('concepto', models.CharField(blank=True, max_length=150, null=True, verbose_name='Concepto')),
                ('observacion', models.CharField(blank=True, max_length=150, null=True, verbose_name='Observación')),
                ('referencia', models.CharField(blank=True, max_length=150, null=True, verbose_name='Referencia')),
                ('serie', models.CharField(max_length=150, verbose_name='Serie')),
                ('cant', models.IntegerField(default=0, verbose_name='Cantidad')),
                ('sucdestino', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sucdestino_fixturetables', to='pos.Sucursal')),
                ('sucorigen', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sucorigen_fixturetables', to='pos.Sucursal')),
            ],
            options={
                'verbose_name': 'Transferencia',
                'verbose_name_plural': 'Transferencia',
                'ordering': ['id'],
            },
        ),
    ]