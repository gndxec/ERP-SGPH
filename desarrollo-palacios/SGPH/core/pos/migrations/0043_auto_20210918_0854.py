# Generated by Django 2.2.12 on 2021-09-18 15:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0042_sale_recargo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='purchaseorder',
            name='state',
            field=models.CharField(choices=[('Enviado', 'Enviado'), ('Aprobar', 'Aprobar'), ('Anulado', 'Anulado'), ('Aprobado', 'Aprobado'), ('Asignar Series', 'Asignar Series'), ('Rechazado', 'Rechazado')], default='Enviado', max_length=50),
        ),
        migrations.AlterField(
            model_name='purchaserequest',
            name='state',
            field=models.CharField(choices=[('Enviado', 'Enviado'), ('Aprobar', 'Aprobar'), ('Anulado', 'Anulado'), ('Aprobado', 'Aprobado'), ('Asignar Series', 'Asignar Series'), ('Rechazado', 'Rechazado')], default='Enviado', max_length=50),
        ),
    ]