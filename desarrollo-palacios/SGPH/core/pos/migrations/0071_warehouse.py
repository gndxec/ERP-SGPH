# Generated by Django 2.2.12 on 2021-09-29 18:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0070_auto_20210929_1105'),
    ]

    operations = [
        migrations.CreateModel(
            name='Warehouse',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('encargado', models.CharField(blank=True, max_length=150, null=True, verbose_name='Encargado de Bodega')),
                ('stock', models.IntegerField(default=0, verbose_name='Stock')),
                ('stockmax', models.IntegerField(default=0, verbose_name='Stock Máximo')),
                ('stockmin', models.IntegerField(default=0, verbose_name='Stock Mínimo')),
                ('sucursal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pos.Sucursal')),
            ],
            options={
                'verbose_name': 'Bodega',
                'verbose_name_plural': 'Bodega',
                'ordering': ['id'],
            },
        ),
    ]
