# Generated by Django 2.2.12 on 2021-09-29 15:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0067_seriesasignarcompra_serie'),
    ]

    operations = [
        migrations.AddField(
            model_name='seriesasignarcompra',
            name='relacion',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='pos.PurchaseRequest'),
            preserve_default=False,
        ),
    ]