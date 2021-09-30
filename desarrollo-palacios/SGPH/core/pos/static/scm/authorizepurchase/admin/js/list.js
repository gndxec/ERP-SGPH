var tblPurchaseOrder;
var input_daterange;

function getData(all) {
    var parameters = {
        'action': 'search',
        'start_date': input_daterange.data('daterangepicker').startDate.format('YYYY-MM-DD'),
        'end_date': input_daterange.data('daterangepicker').endDate.format('YYYY-MM-DD'),
    };

    if (all) {
        parameters['start_date'] = '';
        parameters['end_date'] = '';
    }

    tblPurchaseOrder = $('#data').DataTable({
        responsive: true,
        autoWidth: false,
        destroy: true,
        deferRender: true,
        ajax: {
            url: pathname,
            type: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            data: parameters,
            dataSrc: ""
        },
        columns: [
            { data: "id" },
            { data: "sucursal.name" },
            //{ data: "provider.name" },
            //{ data: "provider.ruc" },
            { data: "date_joined" },
            { data: "state" },
            //{ data: "subtotal" },
            //{ data: "state" },
            //{ data: "concepto" },
            { data: "id" },
        ],
        columnDefs: [{
                targets: [-2],
                class: 'text-center',
                render: function(data, type, row) {
                    if (row.state === 'Aprobado') {
                        return '<span class="badge badge-info">' + row.state + '</span>';
                    }
                    return '<span class="badge badge-success">' + row.state + '</span>';
                }
            },

            {
                targets: [-1],
                class: 'text-center',
                render: function(data, type, row) {
                    var buttons = '';
                    buttons += '<a class="btn btn-primary btn-xs btn-flat" rel="detail"><i class="fas fa-folder-open"></i></a> ';
                    buttons += '<a href="/pos/scm/authorizepurchase/delete/' + row.id + '/" class="btn btn-danger btn-xs btn-flat"><i class="fas fa-trash"></i></a> ';
                    buttons += '<a href="/pos/scm/authorizepurchase/update/' + row.id + '/" class="btn btn-warning btn-xs btn-flat" title= "Editar"><i class="fas fa-edit"></i></a> ';
                    if ((row.state == 'Aprobado')) {
                        buttons += '<a href="/pos/scm/authorizepurchase/print/request/' + row.id + '/" target="_blank" class="btn btn-primary btn-xs btn-flat"title= "Orden"><i class="fas fa-print"></i></a> ';

                    }
                    return buttons;
                }
            },
        ],
        rowCallback: function(row, data, index) {

        },
        initComplete: function(settings, json) {

        }
    });
}

$(function() {

    input_daterange = $('input[name="date_range"]');

    input_daterange
        .daterangepicker({
            language: 'auto',
            startDate: new Date(),
            locale: {
                format: 'YYYY-MM-DD',
            }
        }).on('apply.daterangepicker', function(ev, picker) {
            getData(false);
        });

    $('.drp-buttons').hide();

    getData(false);

    $('.btnSearch').on('click', function() {
        getData(false);
    });

    $('.btnSearchAll').on('click', function() {
        getData(true);
    });



    $('#data tbody')
        .on('click', 'a[rel="detail"]', function() {
            $('.tooltip').remove();
            var tr = tblPurchaseOrder.cell($(this).closest('td, li')).index();
            var row = tblPurchaseOrder.row(tr.row).data();
            console.log('tr', tr);
            console.log('row', row);
            $('#tblDetails').DataTable({
                // responsive: true,
                // autoWidth: false,
                destroy: true,
                ajax: {
                    url: pathname,
                    type: 'POST',
                    headers: {
                        'X-CSRFToken': csrftoken
                    },
                    data: {
                        'action': 'search_detproducts',
                        'id': row.id
                    },
                    dataSrc: ""
                },
                scrollX: true,
                scrollCollapse: true,
                columns: [
                    { data: "product.name" },
                    { data: "product.category.name" },
                    { data: "price" },
                    { data: "cant" },
                    { data: "subtotal" },

                ],
                columnDefs: [{
                        targets: [-1, -3],
                        class: 'text-center',
                        render: function(data, type, row) {
                            return '$' + parseFloat(data).toFixed(2);
                        }
                    },
                    {
                        targets: [-2, -4, -5],
                        class: 'text-center',
                        render: function(data, type, row) {
                            return data;
                        }
                    }


                ]
            });


            var invoice = [];
            invoice.push({ 'id': 'Fecha de Compra', 'name': row.date_joined });
            //console.log(row.provider.name);
            //invoice.push({ 'id': 'Plazo', 'name': row.plazo.name });
            console.log('ent', row.plazo.length);
            if ((!row.plazo.name).length) {
                console.log('ent', (!row.plazo.name).length);
                //invoice.push({ 'id': 'Proveedor', 'name': row.provider.name });
                //invoice.push({ 'id': 'Concepto', 'name': row.concepto });
                invoice.push({ 'id': 'Plazo', 'name': row.plazo.name });
            }
            invoice.push({ 'id': 'Concepto', 'name': row.concepto });
            invoice.push({ 'id': 'Sucursal', 'name': row.sucursal.name });

            invoice.push({ 'id': 'Forma de Pago', 'name': row.payment_condition.name });
            invoice.push({ 'id': 'Subtotal', 'name': row.subtotal });

            invoice.push({ 'id': 'Descuento', 'name': row.dscto + ' %' });

            invoice.push({ 'id': 'Iva', 'name': row.iva + ' %' });

            //invoice.push({ 'id': 'Total Iva', 'name': '$' + row.total_iva });
            //invoice.push({ 'id': 'Total Descuento', 'name': '$' + row.total_dscto });
            //invoice.push({ 'id': 'Entrada', 'name': '$' + row.entrada });
            invoice.push({ 'id': 'Total', 'name': '$' + row.total });


            $('#tblInvoice').DataTable({
                responsive: true,
                autoWidth: false,
                destroy: true,
                data: invoice,
                paging: false,
                ordering: false,
                info: false,
                columns: [
                    { data: "id" },
                    { data: "name" },
                ],
                columnDefs: [{
                    targets: [0, 1],
                    class: 'text-left',
                    render: function(data, type, row) {
                        return data;
                    }
                }, ]
            });

            $('.nav-tabs a[href="#home"]').tab('show');



            $('#myModalDetails').modal('show');
        });
});