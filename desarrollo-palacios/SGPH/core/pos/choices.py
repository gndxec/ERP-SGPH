payment_condition = (
    ('contado', 'Contado'),
    ('credito', 'Credito'),
)

payment_method = (
    ('efectivo', 'Efectivo'),
    ('tarjeta_debito_credito', 'Tarjeta de Debito / Credito'),
    ('efectivo_tarjeta', 'Efectivo y Tarjeta'),
)

voucher = (
    ('ticket', 'Ticket'),
    ('factura', 'Factura'),
)
state_request = (
    ('Enviado', 'Enviado'),
    ('Aprobar', 'Aprobar'),
    #('Solicitud', 'Solicitud'),

    ('Anulado', 'Anulado'),
    ('Aprobado', 'Aprobado'),
    ('Asignar Series', 'Asignar Series'),
    ('Rechazado', 'Rechazado'),
    ('Recibido', 'Recibido'),

)
vouchersol = (
    ('cotizacion', 'Cotización'),
)

state_sale = (
    ('Cotización','Cotización'),
    ('Pedido', 'Pedido'),   
)
state_transfer = (
    ('Transferencia Realizada','Transferencia Realizada'),
    ('Transferencia Recibida','Transferencia Recibida'),
)
state_refunds = (
    ('Realizado', 'Realizado'),
    ('Pendiente', 'Pendiente'),
)