var current_date;

var fvSale;
var fvClient;

var select_client;
var input_birthdate;
var select_paymentcondition;
var select_paymentmethod;
var input_cash;
var input_cardnumber;
var input_amountdebited;
var input_titular;
var input_change;

var select_plazo;
var select_sucursal;
//var input_entrada;
var select_tval;

var tblSearchProducts;
var tblProducts;

var input_searchclient;
var input_searchproducts;
var input_endcredit;
var inputs_vents;

var vents = {
    details: {
        subtotal: 0.00,
        iva: 0.00,
        total_iva: 0.00,
        dscto: 0.00,
        entrada: 0.00,
        subtotaldos: 0.00,
        subtotaltres: 0.00,
        total_dscto: 0.00,
        total: 0.00,
        cash: 0.00,
        change: 0.00,
        products: [],
    },
    calculate_invoice: function() {
        var total = 0.00;
        //var entrada = $('input[name="entrada"]').val();

        $.each(this.details.products, function(i, item) {

            console.log('valor de p', document.getElementById('id_tval').value);
            console.log('valor de pf', document.getElementById('id_tval').value);
            console.log('valor de plazo', document.getElementById('id_tval').value);

            if (document.getElementById('id_tval').value == 0) {
                item.pvpchange = item.pvp;
                console.log('entraaaa111');
                //} else if (document.getElementById('tval').value != 0) {
                //  dict.pvpchange = parseFloat(dict.pvp) - (parseFloat(dict.pvp) / 100);
                //console.log('enntr22');
            } else if (document.getElementById('id_tval').value != 0) {
                item.pvpchange = parseFloat(item.pvp) - (parseFloat(item.pvp) / 100);


            }

            let input_tval = document.getElementById('id_tval');
            let aval = input_tval.value;
            var valorft = 0.00;
            valorft = parseFloat(parseFloat(item.pvp) - (parseFloat(item.pvp) * parseFloat(aval / 100)));
            console.log('enntr23', valorft.toFixed(2));
            item.pvpchange = valorft.toFixed(2);

            item.cant = parseInt(item.cant);
            item.subtotal = item.cant * parseFloat(item.pvpchange);
            item.total_dscto = (parseFloat(item.dscto) / 100) * item.subtotal;
            item.total = item.subtotal - item.total_dscto;
            total += item.total;



            //console.log('ppp', item.full_name);
            //let input_name = document.getElementById('nombprod');
            //input_name.value = item.full_name;
            //console.log('tvalentran', input_name.value);
        });

        vents.details.subtotal = total;
        vents.details.dscto = parseFloat($('input[name="dscto"]').val());

        vents.details.entrada = parseFloat($('input[name="entrada"]').val());
        console.log('entrada', vents.details.entrada);

        vents.details.total_dscto = vents.details.subtotal * (vents.details.dscto / 100);
        console.log('subotal1', vents.details.subtotal);


        console.log('total_iva', vents.details.total_iva);

        vents.details.subtotaldos = vents.details.subtotal - vents.details.total_dscto;
        vents.details.subtotaldos = parseFloat(vents.details.subtotaldos.toFixed(2));

        vents.details.total_iva = parseFloat(vents.details.subtotaldos) * parseFloat(vents.details.iva / 100);
        console.log('subtotaldol', vents.details.subtotaldos);

        vents.details.subtotaltres = vents.details.subtotaldos + vents.details.total_iva;
        vents.details.subtotaltres = parseFloat(vents.details.subtotaltres.toFixed(2));
        console.log('subt', vents.details.subtotaltres);
        vents.details.total = vents.details.subtotaltres - vents.details.entrada;
        vents.details.total = parseFloat(vents.details.total.toFixed(2));
        console.log(vents.details.total);


        //vents.details.subtotaldos = vents.details.subtotal - vents.details.total_dscto - vents.details.entrada;
        //vents.details.total = vents.details.subtotal + vents.details.total_iva - vents.details.total_dscto;
        //vents.details.total = parseFloat(vents.details.total.toFixed(2));

        $('input[name="subtotal"]').val(vents.details.subtotal.toFixed(2));
        $('input[name="iva"]').val(vents.details.iva.toFixed(2));
        $('input[name="total_iva"]').val(vents.details.total_iva.toFixed(2));
        $('input[name="total_dscto"]').val(vents.details.total_dscto.toFixed(2));
        $('input[name="total"]').val(vents.details.total.toFixed(2));
        $('input[name="amount"]').val(vents.details.total.toFixed(2));
        $('input[name="subtotaldos"]').val(vents.details.subtotaldos.toFixed(2));
        $('input[name="subtotaltres"]').val(vents.details.subtotaltres.toFixed(2));
        $('input[name="entrada"]').val(vents.details.entrada.toFixed(2));
        $('input[name="amount_debited"]').val(vents.details.total.toFixed(2));
        $('input[name="change"]').val(-(vents.details.total.toFixed(2)));



    },
    list_products: function() {
        this.calculate_invoice();
        tblProducts = $('#tblProducts').DataTable({
            //responsive: true,
            autoWidth: false,
            destroy: true,
            data: this.details.products,
            ordering: false,
            lengthChange: false,
            searching: false,
            paginate: false,
            scrollX: true,
            scrollCollapse: true,
            columns: [
                { data: "id" },
                { data: "name" },
                //{data: "category.name"},
                { data: "stock" },
                { data: "cant" },
                //{ data: "price_current" },
                { data: "pvpchange" },
                { data: "subtotal" },
                { data: "dscto" },
                { data: "total_dscto" },
                { data: "total" },
            ],
            columnDefs: [{
                    targets: [2],
                    class: 'text-center',
                    render: function(data, type, row) {
                        if (row.category.inventoried) {
                            if (row.stock > 0) {
                                return '<span class="badge badge-success">' + row.stock + '</span>';
                            }
                            return '<span class="badge badge-danger">' + row.stock + '</span>';
                        }
                        return '<span class="badge badge-secondary">Sin stock</span>';
                    }
                },
                {
                    targets: [-6],
                    class: 'text-center',
                    render: function(data, type, row) {
                        return '<input type="text" class="form-control input-sm" style="width: 100px;" autocomplete="off" name="cant" value="' + row.cant + '">';
                    }
                },
                {
                    targets: [-3],
                    class: 'text-center',
                    render: function(data, type, row) {
                        return '<input type="text" class="form-control input-sm" style="width: 100px;" autocomplete="off" name="dscto_unitary" value="' + row.dscto + '">';
                    }
                },
                {
                    targets: [-5],
                    class: 'text-center',
                    render: function(data, type, row) {
                        return '<input type="text" class="form-control input-sm" readonly style="width: 100px;" autocomplete="off" name="pvpchange" value="' + '$' + row.pvpchange + '">';
                    }
                },
                {
                    targets: [-2, -4, -1],
                    //targets: [-1, -2, -4],
                    class: 'text-center',
                    render: function(data, type, row) {
                        return '$' + parseFloat(data).toFixed(2);

                    }
                },
                //pvpchange
                //{
                //    targets: [-5],
                //    class: 'text-center',
                //    render: function(data, type, row) {
                //        //return '$' + parseFloat(data).toFixed(2);
                //        return '<input type="text" class="form-control input-sm" style="width: 100px;" autocomplete="off" name="pvpchange" value="' + row.pvpchange + '">';

                //    }
                //},


                //
                {
                    targets: [0],
                    class: 'text-center',
                    render: function(data, type, row) {
                        return '<a rel="remove" class="btn btn-danger btn-flat btn-xs"><i class="fa fa-trash fa-1x"></i></a>';
                    }
                },
            ],
            rowCallback: function(row, data, index) {
                var tr = $(row).closest('tr');
                var stock = data.category.inventoried ? data.stock : 1000000;
                tr.find('input[name="cant"]')
                    .TouchSpin({
                        min: 1,
                        max: stock,
                        verticalbuttons: true
                    })
                    .keypress(function(e) {
                        return validate_form_text('numbers', e, null);
                    });


                //pvpchange
                //tr.find('input[name="pvpchange"]')
                //    .TouchSpin({
                //        min: 0.00,
                //        step: 0.01,
                //        decimals: 2,
                //        boostat: 5,
                //        verticalbuttons: true,
                //        maxboostedstep: 10,
                //    })
                //    .keypress(function(e) {
                //        return validate_decimals($(this), e);
                //    });




                tr.find('input[name="dscto_unitary"]')
                    .TouchSpin({
                        min: 0.00,
                        max: 100,
                        step: 0.01,
                        decimals: 2,
                        boostat: 5,
                        verticalbuttons: true,
                        maxboostedstep: 10,
                    })
                    .keypress(function(e) {
                        return validate_decimals($(this), e);
                    });
            },
            initComplete: function(settings, json) {

            },
        });
    },
    get_products_ids: function() {
        var ids = [];
        $.each(this.details.products, function(i, item) {
            ids.push(item.id);
        });
        return ids;
    },
    add_product: function(item) {
        this.details.products.push(item);
        this.list_products();
    },
};

document.addEventListener('DOMContentLoaded', function(e) {
    const frmClient = document.getElementById('frmClient');
    fvClient = FormValidation.formValidation(frmClient, {
            locale: 'es_ES',
            localization: FormValidation.locales.es_ES,
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                submitButton: new FormValidation.plugins.SubmitButton(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
                icon: new FormValidation.plugins.Icon({
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh',
                }),
            },
            fields: {
                first_name: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 2,
                        },
                    }
                },
                last_name: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 2,
                        },
                    }
                },
                dni: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 10
                        },
                        digits: {},
                        remote: {
                            url: pathname,
                            data: function() {
                                return {
                                    obj: frmClient.querySelector('[name="dni"]').value,
                                    type: 'dni',
                                    action: 'validate_client'
                                };
                            },
                            message: 'El número de cedula ya se encuentra registrado',
                            method: 'POST',
                            headers: {
                                'X-CSRFToken': csrftoken
                            },
                        }
                    }
                },
                mobile: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 7
                        },
                        digits: {},
                        remote: {
                            url: pathname,
                            data: function() {
                                return {
                                    obj: frmClient.querySelector('[name="mobile"]').value,
                                    type: 'mobile',
                                    action: 'validate_client'
                                };
                            },
                            message: 'El número de teléfono ya se encuentra registrado',
                            method: 'POST',
                            headers: {
                                'X-CSRFToken': csrftoken
                            },
                        }
                    }
                },
                email: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 5
                        },
                        regexp: {
                            regexp: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/i,
                            message: 'El formato email no es correcto'
                        },
                        remote: {
                            url: pathname,
                            data: function() {
                                return {
                                    obj: frmClient.querySelector('[name="email"]').value,
                                    type: 'email',
                                    action: 'validate_client'
                                };
                            },
                            message: 'El email ya se encuentra registrado',
                            method: 'POST',
                            headers: {
                                'X-CSRFToken': csrftoken
                            },
                        }
                    }
                },
                address: {
                    validators: {
                        stringLength: {
                            min: 4,
                        }
                    }
                },
                image: {
                    validators: {
                        file: {
                            extension: 'jpeg,jpg,png',
                            type: 'image/jpeg,image/png',
                            maxFiles: 1,
                            message: 'Introduce una imagen válida'
                        }
                    }
                },
                birthdate: {
                    validators: {
                        notEmpty: {
                            message: 'La fecha es obligatoria'
                        },
                        date: {
                            format: 'YYYY-MM-DD',
                            message: 'La fecha no es válida'
                        }
                    },
                },
            },
        })
        .on('core.element.validated', function(e) {
            if (e.valid) {
                const groupEle = FormValidation.utils.closest(e.element, '.form-group');
                if (groupEle) {
                    FormValidation.utils.classSet(groupEle, {
                        'has-success': false,
                    });
                }
                FormValidation.utils.classSet(e.element, {
                    'is-valid': false,
                });
            }
            const iconPlugin = fvClient.getPlugin('icon');
            const iconElement = iconPlugin && iconPlugin.icons.has(e.element) ? iconPlugin.icons.get(e.element) : null;
            iconElement && (iconElement.style.display = 'none');
        })
        .on('core.validator.validated', function(e) {
            if (!e.result.valid) {
                const messages = [].slice.call(frmClient.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
                messages.forEach((messageEle) => {
                    const validator = messageEle.getAttribute('data-validator');
                    messageEle.style.display = validator === e.validator ? 'block' : 'none';
                });
            }
        })
        .on('core.form.valid', function() {
            var parameters = new FormData(fvClient.form);
            parameters.append('action', 'create_client');
            submit_formdata_with_ajax('Notificación', '¿Estas seguro de realizar la siguiente acción?', pathname,
                parameters,
                function(request) {
                    var newOption = new Option(request.user.full_name + ' / ' + request.user.dni, request.id, false, true);
                    select_client.append(newOption).trigger('change');
                    fvSale.revalidateField('client');
                    $('#myModalClient').modal('hide');
                }
            );
        });
});

document.addEventListener('DOMContentLoaded', function(e) {
    //function validateChange() {
    //    var cash = parseFloat(input_cash.val())
    //    var method_payment = select_paymentmethod.val();
    //    var total = parseFloat(vents.details.total);
    //    if (method_payment === 'efectivo') {
    //        if (cash < total) {
    //            return { valid: false, message: 'El efectivo debe ser mayor o igual al total a pagar' };
    //        }
    //    } else if (method_payment === 'efectivo_tarjeta') {
    //        var amount_debited = (total - cash);
    //        input_amountdebited.val(amount_debited.toFixed(2));
    //    }
    //    return { valid: true };
    //}

    const frmSale = document.getElementById('frmSale');
    fvSale = FormValidation.formValidation(frmSale, {
            locale: 'es_ES',
            localization: FormValidation.locales.es_ES,
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                submitButton: new FormValidation.plugins.SubmitButton(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
                // excluded: new FormValidation.plugins.Excluded(),
                icon: new FormValidation.plugins.Icon({
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh',
                }),
            },
            fields: {
                client: {
                    validators: {
                        notEmpty: {
                            message: 'Seleccione un cliente'
                        },
                    }
                },
                end_credit: {
                    validators: {
                        notEmpty: {
                            enabled: false,
                            message: 'La fecha es obligatoria'
                        },
                        date: {
                            format: 'YYYY-MM-DD',
                            message: 'La fecha no es válida'
                        }
                    }
                },
                payment_condition: {
                    validators: {
                        notEmpty: {
                            message: 'Seleccione una forma de pago'
                        },
                    }
                },
                payment_method: {
                    validators: {
                        notEmpty: {
                            message: 'Seleccione un método de pago'
                        },
                    }
                },
                type_voucher: {
                    validators: {
                        notEmpty: {
                            message: 'Seleccione un tipo de comprobante'
                        },
                    }
                },
                card_number: {
                    validators: {
                        notEmpty: {
                            enabled: false,
                        },
                        regexp: {
                            regexp: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
                            message: 'Debe ingresar un numéro de tarjeta en el siguiente formato 1234 5678 9103 2247'
                        },
                        stringLength: {
                            min: 2,
                            max: 19,
                        },
                    }
                },
                titular: {
                    validators: {
                        notEmpty: {
                            enabled: false,
                        },
                        stringLength: {
                            min: 3,
                        },
                    }
                },
                amount_debited: {
                    validators: {
                        notEmpty: {
                            enabled: false,
                        },
                        numeric: {
                            message: 'El valor no es un número',
                            thousandsSeparator: '',
                            decimalSeparator: '.'
                        },
                    }
                },
                cash: {
                    validators: {
                        notEmpty: {},
                        numeric: {
                            message: 'El valor no es un número',
                            thousandsSeparator: '',
                            decimalSeparator: '.'
                        }
                    }
                },
                change: {
                    validators: {
                        notEmpty: {},
                        callback: {
                            //message: 'El cambio no puede ser negativo',
                            callback: function(input) {
                                return validateChange();
                            }
                        }
                    }
                },
            },
        })
        .on('core.element.validated', function(e) {
            if (e.valid) {
                const groupEle = FormValidation.utils.closest(e.element, '.form-group');
                if (groupEle) {
                    FormValidation.utils.classSet(groupEle, {
                        'has-success': false,
                    });
                }
                FormValidation.utils.classSet(e.element, {
                    'is-valid': false,
                });
            }
            const iconPlugin = fvSale.getPlugin('icon');
            const iconElement = iconPlugin && iconPlugin.icons.has(e.element) ? iconPlugin.icons.get(e.element) : null;
            iconElement && (iconElement.style.display = 'none');
        })
        .on('core.validator.validated', function(e) {
            if (!e.result.valid) {
                const messages = [].slice.call(frmSale.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
                messages.forEach((messageEle) => {
                    const validator = messageEle.getAttribute('data-validator');
                    messageEle.style.display = validator === e.validator ? 'block' : 'none';
                });
            }
        })
        .on('core.form.valid', function() {
            var parameters = new FormData($(fvSale.form)[0]);
            console.log('entra submit');
            parameters.append('action', $('input[name="action"]').val());
            parameters.append('payment_method', select_paymentmethod.val());
            console.log('asdc', parameters.append('payment_method', select_paymentmethod.val()));
            parameters.append('payment_condition', select_paymentcondition.val());
            console.log('entra condi', select_paymentcondition.val());


            //var e = document.getElementById("id_plazo");
            //var strUser = e.options[e.selectedIndex].text;
            //console.log('entra fg', strUser);
            parameters.append('plazo', select_plazo.val());
            console.log('plazo', select_plazo.val());

            parameters.append('sucursal', select_sucursal.val());
            console.log('plazo', select_sucursal.val());

            parameters.append('tval', select_tval.val());
            console.log('tval', select_tval.val());

            parameters.append('entrada', $('input[name="entrada"]').val());
            console.log('entrada', $('input[name="entrada"]').val());

            parameters.append('subtotaldos', $('input[name="subtotaldos"]').val());
            console.log('subtotaldos', $('input[name="subtotaldos"]').val());

            parameters.append('subtotaltres', $('input[name="subtotaltres"]').val());
            console.log('subtotaltres', $('input[name="subtotaltres"]').val());


            parameters.append('end_credit', input_endcredit.val());
            parameters.append('cash', input_cash.val());
            parameters.append('change', input_change.val());
            parameters.append('card_number', input_cardnumber.val());
            parameters.append('titular', input_titular.val());
            parameters.append('dscto', $('input[name="dscto"]').val());
            parameters.append('amount_debited', input_amountdebited.val());
            console.log('x');
            console.log(parameters.append('change', input_change.val()));
            if (vents.details.products.length === 0) {
                message_error('Debe tener al menos un item en el detalle de la venta');
                $('.nav-tabs a[href="#menu1"]').tab('show');
                return false;
            }
            parameters.append('products', JSON.stringify(vents.details.products));
            let urlrefresh = fvSale.form.getAttribute('data-url');
            submit_formdata_with_ajax('Notificación',
                '¿Estas seguro de realizar la siguiente acción ?',
                pathname,
                parameters,
                function(request) {
                    dialog_action('Notificación', '¿Desea Imprimir la Factura?', function() {
                        window.open('/pos/crm/sale/print/voucher/' + request.id + '/', '_blank');
                        location.href = urlrefresh;
                    }, function() {
                        location.href = urlrefresh;
                    });
                },
            );
        });
});

function printInvoice(id) {
    var printWindow = window.open("/pos/crm/sale/print/voucher/" + id + "/", 'Print', 'left=200, top=200, width=950, height=500, toolbar=0, resizable=0');
    printWindow.addEventListener('load', function() {
        printWindow.print();
    }, true);
}

function hideRowsVents(values) {
    $.each(values, function(key, value) {
        if (value.enable) {
            $(inputs_vents[value.pos]).show();
        } else {
            $(inputs_vents[value.pos]).hide();
        }
    });
}

$(function() {

    current_date = new moment().format("YYYY-MM-DD");
    input_searchclient = $('input[name="search_client"]');
    input_searchproducts = $('input[name="searchproducts"]');
    select_client = $('select[name="client"]');
    console.log('ssssss', select_client);
    input_birthdate = $('input[name="birthdate"]');
    input_endcredit = $('input[name="end_credit"]');
    select_paymentcondition = $('select[name="payment_condition"]');

    select_plazo = $('select[name="plazo"]');
    console.log('dddd', select_plazo);


    select_sucursal = $('select[name="sucursal"]');
    console.log('dddd', select_sucursal);
    select_tval = $('input[name="tval"]');


    select_paymentmethod = $('select[name="payment_method"]');
    console.log('ashj', select_paymentmethod);
    input_cardnumber = $('input[name="card_number"]');
    input_amountdebited = $('input[name="amount_debited"]');
    input_cash = $('input[name="cash"]');
    input_change = $('input[name="change"]');
    input_titular = $('input[name="titular"]');
    modal_sale = $('#myModalSale');
    inputs_vents = $('.rowVents');

    $('.select2').select2({
        theme: 'bootstrap4',
        language: "es",
    });

    /* Product */

    input_searchproducts.autocomplete({
        source: function(request, response) {
            $.ajax({
                url: pathname,
                data: {
                    'action': 'search_products',
                    'term': request.term,
                    'ids': JSON.stringify(vents.get_products_ids()),
                },
                dataType: "json",
                type: "POST",
                headers: {
                    'X-CSRFToken': csrftoken
                },
                beforeSend: function() {

                },
                success: function(data) {
                    response(data);
                }
            });
        },
        min_length: 3,
        delay: 300,
        select: function(event, ui) {
            event.preventDefault();
            $(this).blur();
            if (ui.item.stock === 0 && ui.item.category.inventoried) {
                message_error('El stock de este producto esta en 0');
                return false;
            }
            ui.item.cant = 1;
            //pvpchange
            ui.item.pvpchange = 0.00;
            vents.add_product(ui.item);
            $(this).val('').focus();
        }
    });

    $('.btnClearProducts').on('click', function() {
        input_searchproducts.val('').focus();
    });

    $('#tblProducts tbody')
        .on('change', 'input[name="cant"]', function() {
            var tr = tblProducts.cell($(this).closest('td, li')).index();
            vents.details.products[tr.row].cant = parseInt($(this).val());
            vents.calculate_invoice();
            $('td:eq(5)', tblProducts.row(tr.row).node()).html('$' + vents.details.products[tr.row].subtotal.toFixed(2));
            $('td:eq(8)', tblProducts.row(tr.row).node()).html('$' + vents.details.products[tr.row].total.toFixed(2));
        })
        .on('change', 'input[name="dscto_unitary"]', function() {
            var tr = tblProducts.cell($(this).closest('td, li')).index();
            vents.details.products[tr.row].dscto = parseFloat($(this).val());
            vents.calculate_invoice();
            $('td:eq(7)', tblProducts.row(tr.row).node()).html('$' + vents.details.products[tr.row].total_dscto.toFixed(2));
            $('td:eq(8)', tblProducts.row(tr.row).node()).html('$' + vents.details.products[tr.row].total.toFixed(2));
        })
        .on('click', 'a[rel="remove"]', function() {
            var tr = tblProducts.cell($(this).closest('td, li')).index();
            vents.details.products.splice(tr.row, 1);
            tblProducts.row(tr.row).remove().draw();
        });

    $('.btnSearchProducts').on('click', function() {
        tblSearchProducts = $('#tblSearchProducts').DataTable({
            responsive: true,
            autoWidth: false,
            destroy: true,
            ajax: {
                url: pathname,
                type: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken
                },
                data: {
                    'action': 'search_products',
                    'term': input_searchproducts.val(),
                    'ids': JSON.stringify(vents.get_products_ids()),
                },
                dataSrc: ""
            },
            columns: [
                { data: "name" },
                { data: "category.name" },
                { data: "pvp" },
                { data: "price_promotion" },
                { data: "stock" },
                { data: "id" },
            ],
            columnDefs: [{
                    targets: [-3, -4],
                    class: 'text-center',
                    render: function(data, type, row) {
                        return '$' + parseFloat(data).toFixed(2);
                    }
                },
                {
                    targets: [-2],
                    class: 'text-center',
                    render: function(data, type, row) {
                        if (row.category.inventoried) {
                            if (row.stock > 0) {
                                return '<span class="badge badge-success">' + row.stock + '</span>';
                            }
                            return '<span class="badge badge-danger">' + row.stock + '</span>';
                        }
                        return '<span class="badge badge-secondary">Sin stock</span>';
                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    render: function(data, type, row) {
                        return '<a rel="add" class="btn btn-success btn-flat btn-xs"><i class="fas fa-plus"></i></a>';
                    }
                }
            ],
            rowCallback: function(row, data, index) {

            },
        });
        $('#myModalSearchProducts').modal('show');
    });

    $('#tblSearchProducts tbody').on('click', 'a[rel="add"]', function() {
        var row = tblSearchProducts.row($(this).parents('tr')).data();
        row.cant = 1;
        //pvpvhange
        row.pvpchange = 0.00;
        vents.add_product(row);
        tblSearchProducts.row($(this).parents('tr')).remove().draw();
    });

    $('.btnRemoveAllProducts').on('click', function() {
        if (vents.details.products.length === 0) return false;
        dialog_action('Notificación', '¿Estas seguro de eliminar todos los items de tu detalle?', function() {
            vents.details.products = [];
            vents.list_products();
        });
    });

    /* Client */

    select_client.select2({
            theme: "bootstrap4",
            language: 'es',
            allowClear: true,
            // dropdownParent: modal_sale,
            ajax: {
                delay: 250,
                type: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken
                },
                url: pathname,
                data: function(params) {
                    var queryParameters = {
                        term: params.term,
                        action: 'search_client'
                    }
                    return queryParameters;
                },
                processResults: function(data) {
                    return {
                        results: data
                    };
                },
            },
            placeholder: 'Ingrese una descripción',
            minimumInputLength: 1,
        })
        .on('select2:select', function(e) {
            fvSale.revalidateField('client');
        })
        .on('select2:clear', function(e) {
            fvSale.revalidateField('client');
        });

    $('.btnAddClient').on('click', function() {
        input_birthdate.datetimepicker('date', new Date());
        $('#myModalClient').modal('show');
    });

    $('#myModalClient').on('hidden.bs.modal', function() {
        fvClient.resetForm(true);
    });

    $('input[name="dni"]').keypress(function(e) {
        return validate_form_text('numbers', e, null);
    });

    $('input[name="mobile"]').keypress(function(e) {
        return validate_form_text('numbers', e, null);
    });

    input_birthdate.datetimepicker({
        useCurrent: false,
        format: 'YYYY-MM-DD',
        locale: 'es',
        keepOpen: false,
        maxDate: current_date
    });

    input_birthdate.on('change.datetimepicker', function(e) {
        fvClient.revalidateField('birthdate');
    });


    //amorti

    $('#btnAddAmort').click(function() {


        console.log('aqui');
        var e = document.getElementById("id_total");
        var strtt = e.value;
        console.log('entra mt', strtt);
        let totalpagar = document.getElementById('amtot');
        totalpagar.value = (strtt);
        console.log('enasig', totalpagar.value);



        var e = document.getElementById("id_plazo");
        var strq = e.options[e.selectedIndex].text;
        console.log('entra fgm', strq);
        let plaam = document.getElementById('ampla');
        plaam.value = strq;
        console.log('enasig', plaam.value);






        var arname = $('#id_client').select2('data')[0];
        var val = (arname['text']);
        console.log('ent', val);



        let nameat = document.getElementById('amclient');
        nameat.value = val;
        console.log('ename', nameat.value);


        const llenarTabla = document.querySelector('#tblAmort tbody');


        while (llenarTabla.firstChild) {
            llenarTabla.removeChild(llenarTabla.firstChild);
        }




        $('#myModalAmort').modal('show');
    });


    $('#myModalAmort').on('hidden.bs.modal', function(e) {
        $('#frmAmort').trigger('reset');
    })



    $('#frmAmort').on('submit', function(e) {
        console.log("eeeentraaaa");
        e.preventDefault();
        $('#enc').hide();
        var parameters = new FormData(this);






        const llenarTabla = document.querySelector('#tblAmort tbody');


        while (llenarTabla.firstChild) {
            llenarTabla.removeChild(llenarTabla.firstChild);
        }




        var e = document.getElementById("id_total");
        var strtt = e.value;
        console.log('entra mt', strtt);
        let totalpagar = document.getElementById('amtot');
        totalpagar.value = (strtt);
        console.log('enasig', totalpagar.value);



        var e = document.getElementById("id_plazo");
        var strq = e.options[e.selectedIndex].text;
        console.log('entra fgm', strq);
        console.log('tipo');
        console.log('tipo', typeof(strq));

        let arrpla = (strq.split(' '));
        console.log('arrr', arrpla);
        console.log('arrpla', typeof(arrpla));



        var numes = arrpla[0];
        console.log('p', numes)
        let plaam = document.getElementById('ampla');
        plaam.value = strq;
        console.log('enasig', plaam.value);






        let fecha = []
        let fechaActual = Date.now();
        let mes_actual = moment(fechaActual);
        mes_actual.add(1, 'month');
        console.log('asdf', fechaActual);
        console.log('asdf', mes_actual);


        cuota = 0;
        cuota = (strtt / numes).toFixed(2);
        console.log('cuota a pagar', cuota);
        var forent = 0;
        var pago = 0;
        var pagoCapital = 0;
        var monto = 0;
        for (let i = 1; i <= numes; i++) {

            console.log('valor cuota', cuota);
            console.log('monto i', strtt);
            strtt = parseFloat(strtt - cuota);
            console.log('menos', strtt);

            pagoCapital = 0;
            console.log('cantidad de cat', pagoCapital);
            monto = 0;
            console.log('mmm', monto);



            fecha[i] = mes_actual.format('DD-MM-YYYY');
            mes_actual.add(1, 'month');

            forent = forent + 1;
            console.log('cuantas veces', forent);

            const row = document.createElement('tr');
            row.innerHTML = `
                    <td>${forent}</td>
                    <td>${fecha[i]}</td>
                    <td>${cuota}</td>
                    <td>${(strtt.toFixed(2))}</td>
                  
                `;
            llenarTabla.appendChild(row)

        }
        console.log('sale');

    });







    select_paymentcondition.on('change', function() {
        var id = $(this).val();
        console.log('b', id);
        hideRowsVents([{ 'pos': 0, 'enable': false }, { 'pos': 1, 'enable': false }, { 'pos': 2, 'enable': false }]);
        input_cash.val(input_cash.val());
        input_amountdebited.val('0.00');
        switch (id) {
            case "contado":
                console.log('entra cont');
                //fvSale.enableValidator('change');
                fvSale.disableValidator('change');
                fvSale.disableValidator('card_number');
                fvSale.disableValidator('titular');
                fvSale.disableValidator('amount_debited');
                //input_cash.trigger("touchspin.updatesettings", { max: 100000000 });
                hideRowsVents([{ 'pos': 0, 'enable': true }]);
                $('#cambio').children('div').hide();
                hideRowsVents([{ 'pos': 2, 'enable': true }]);
                select_paymentmethod.prop('disabled', false);

                break;
            case "credito":
                //fvSale.disableValidator('select_paymentmethod');

                fvSale.disableValidator('change');
                fvSale.disableValidator('card_number');
                fvSale.disableValidator('titular');
                fvSale.disableValidator('amount_debited');
                //input_amountdebited.val(vents.details.total.toFixed(2));
                //input_titular.val('');
                //hideRowsVents([{ 'pos': 1, 'enable': true }]);
                $('#target').children('div').hide();
                $('#cambio').children('div').hide();
                hideRowsVents([{ 'pos': 2, 'enable': true }]);
                select_paymentmethod.prop('disabled', true);


                break;

        }
    });









    //select_paymentcondition
    //  .on('change', function() {
    //    var id = $(this).val();
    //  console.log('tpmd', id);
    //if (id == "contado") {
    //$('#efectivorec').children('div').show();
    //$('#efectivocam').children('div').show();
    //  $('#target').children('div').show();

    //} else {

    //$('#efectivorec').children('div').hide();
    //$('#efectivocam').children('div').hide();
    //$('#target').children('div').hide();

    //}
    //});










    /* Sale */

    //select_paymentcondition
    //  .on('change', function() {
    //    var id = $(this).val();
    //    console.log('v', id);
    //    hideRowsVents([{ 'pos': 0, 'enable': false }, { 'pos': 1, 'enable': false }, { 'pos': 2, 'enable': false }]);
    //    fvSale.disableValidator('card_number');
    //    fvSale.disableValidator('titular');
    //    fvSale.disableValidator('amount_debited');
    //    fvSale.disableValidator('cash');
    //    fvSale.disableValidator('change');
    //    switch (id) {
    //        case "contado":
    //            fvSale.disableValidator('end_credit');
    //fvSale.disableValidator('entrada');
    //            console.log('cccc');
    //            select_paymentmethod.prop('disabled', false).val('efectivo').trigger('change');
    //            break;
    //        case "credito":
    //          fvSale.enableValidator('end_credit');
    //            //fvSale.enableValidator('entrada');
    //            hideRowsVents([{ 'pos': 2, 'enable': true }]);
    //            select_paymentmethod.prop('disabled', true);
    //            console.log('cre');
    //            break;
    //   }
    //});



    //pricelist dependiendo de plazo(contado-credito desplaza tarifa )
    //$('select[name="select_paymentcondition"]')
    $('select[name="payment_condition"]')
        .on('change', function() {
            var id = $(this).val();
            console.log('entra p', id);
            //var select_pl = $('select[name="plazo"]');
            var optionsplazo = '<option value="">-----</option>';
            //alert(id);

            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken
                },
                data: {
                    'action': 'search_pltipo',
                    'id': id
                },
                dataType: 'json',

            }).done(function(data) {
                console.log('datospresentados', data);
                if (!data.hasOwnProperty('error')) {
                    //console.log(data);
                    select_plazo.html('').select2({
                        theme: 'bootstrap4',
                        language: "es",
                        data: data
                    });

                    return false;
                }
                message_error(data.error);

            }).fail(function(jqHXR, textStatus, errorThrown) {
                alert(textStatus + ':' + errorThrown);

            }).always(function(data) {

            });

        });

    //select_plazo.on('change', function() {
    //    var value = select_plazo.select2('data');
    //    console.log('ent pla', value);
    //});

    //valor de porcentaje % dependiendo el plazo
    $('select[name="plazo"]')
        .on('change', function() {
            var id = $(this).val();
            console.log('entra p', id);
            var select_tval = $('input[name="tval"]');
            console.log('xtval', select_tval);
            var options = '';
            var tempname = '';
            //alert(id);

            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken
                },
                data: {
                    'action': 'search_valor',
                    'id': id
                },
                dataType: 'json',

            }).done(function(data) {
                console.log('datospresentadostval', data);
                if (!data.hasOwnProperty('error')) {
                    console.log(data);
                    $.each(data, function(key, value) {
                        console.log('entraaaaaa js');
                        options = value.desc;
                        tempname = value.name;
                        console.log('xc', options);
                        //console.log('xb', tempname);
                        vents.calculate_invoice();
                        vents.list_products();

                    });

                    return false;
                }
                message_error(data.error);

            }).fail(function(jqHXR, textStatus, errorThrown) {
                alert(textStatus + ':' + errorThrown);

            }).always(function(data) {
                let input_de = document.getElementById('tval');
                input_de.value = options;

                let form_de = document.getElementById('id_tval');
                form_de.value = options;

                vents.list_products();
            });

        });
    $('plazo').trigger('change');








    //valor de porcentaje % dependiendo el recargo de tarjeta
    $('select[name="recargo"]')
        .on('change', function() {
            var id = $(this).val();
            console.log('entra p', id);
            var select_trec = $('input[name="trec"]');
            console.log('xtrec', select_trec);
            var optrec = '';
            var temprec = '';
            //alert(id);

            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken
                },
                data: {
                    'action': 'search_rec',
                    'id': id
                },
                dataType: 'json',

            }).done(function(data) {
                console.log('datospresentadostrec', data);
                if (!data.hasOwnProperty('error')) {
                    console.log(data);
                    $.each(data, function(key, value) {
                        console.log('entraaaaaa js');
                        optrec = value.porc;
                        temprec = value.name;
                        console.log('xc', optrec);
                        //console.log('xb', tempname);
                        //vents.calculate_invoice();
                        //vents.list_products();
                        //input_amountdebited.val(vents.details.total.toFixed(2));
                        var montopag = vents.details.total.toFixed(2);
                        console.log('vtarjeta', montopag)
                        var valortar = parseFloat(montopag * (optrec / 100));
                        console.log('vpt', valortar)
                        var sumrec = parseFloat(montopag) + parseFloat(valortar);
                        console.log('sure', sumrec);
                        var totalrec = sumrec.toFixed(2);
                        //input_amountdebited.value = sumrec;
                        input_amountdebited.val(totalrec);

                        //console.log('monto', input_amountdebited.value);
                        console.log('nueva funci');
                        $('input[name="amount"]').val(totalrec);



                    });

                    return false;
                }
                message_error(data.error);

            }).fail(function(jqHXR, textStatus, errorThrown) {
                alert(textStatus + ':' + errorThrown);

            }).always(function(data) {
                let input_de = document.getElementById('trec');
                input_de.value = optrec;

                //let form_de = document.getElementById('id_tval');
                //form_de.value = options;

                //vents.list_products();
            });

        });
    $('recargo').trigger('change');



























    select_paymentmethod.on('change', function() {
        var id = $(this).val();
        console.log('b', id);
        hideRowsVents([{ 'pos': 0, 'enable': false }, { 'pos': 1, 'enable': false }, { 'pos': 2, 'enable': false }]);
        input_cash.val(input_cash.val());
        input_amountdebited.val('0.00');
        switch (id) {
            case "efectivo":
                //fvSale.enableValidator('change');
                fvSale.disableValidator('change');
                fvSale.disableValidator('card_number');
                fvSale.disableValidator('titular');
                fvSale.disableValidator('amount_debited');
                //input_cash.trigger("touchspin.updatesettings", { max: 100000000 });
                hideRowsVents([{ 'pos': 0, 'enable': true }]);
                $('#cambio').children('div').hide();

                break;
            case "tarjeta_debito_credito":
                fvSale.disableValidator('change');
                fvSale.enableValidator('card_number');
                fvSale.enableValidator('titular');
                fvSale.enableValidator('amount_debited');
                input_amountdebited.val(vents.details.total.toFixed(2));
                //var vtarj = input_amountdebited.val(vents.details.total.toFixed(2));
                input_titular.val('');

                //console.log('trec', trec.val());
                hideRowsVents([{ 'pos': 1, 'enable': true }]);
                $('#target').children('div').hide();

                break;
            case "efectivo_tarjeta":
                input_change.val('0.00');
                fvSale.enableValidator('change');
                fvSale.enableValidator('card_number');
                fvSale.enableValidator('titular');
                fvSale.enableValidator('amount_debited');
                input_cash.trigger("touchspin.updatesettings", { max: vents.details.total });
                hideRowsVents([{ 'pos': 0, 'enable': true }, { 'pos': 1, 'enable': true }]);
                $('#cambio').children('div').hide();
                $('#target').children('div').hide();
                break;
        }
    });

    input_cash
        .TouchSpin({
            min: 0.00,
            max: 100000000,
            step: 0.01,
            decimals: 2,
            boostat: 5,
            verticalbuttons: true,
            maxboostedstep: 10,
        })
        .off('change').on('change touchspin.on.min touchspin.on.max', function() {
            var paymentmethod = select_paymentmethod.val();
            fvSale.revalidateField('cash');
            var total = parseFloat(vents.details.total);
            switch (paymentmethod) {
                case "efectivo_tarjeta":
                    fvSale.revalidateField('amount_debited');
                    fvSale.revalidateField('change');
                    //input_change.val('0.00');
                    break;
                case "efectivo":
                    var cash = parseFloat($(this).val());
                    var change = cash - total;
                    input_change.val(change.toFixed(2));
                    fvSale.revalidateField('change');
                    break;
            }
            return false;
        })
        .keypress(function(e) {
            return validate_decimals($(this), e);
        });

    input_cardnumber
        .on('keypress', function(e) {
            fvSale.revalidateField('card_number');
            return validate_form_text('numbers_spaceless', e, null);
        })
        .on('keyup', function(e) {
            var number = $(this).val();
            var number_nospaces = number.replace(/ /g, "");
            if (number_nospaces.length % 4 === 0 && number_nospaces.length > 0 && number_nospaces.length < 16) {
                number += ' ';
            }
            $(this).val(number);
        });

    input_titular.on('keypress', function(e) {
        return validate_form_text('letters', e, null);
    });

    input_endcredit.datetimepicker({
        useCurrent: false,
        format: 'YYYY-MM-DD',
        locale: 'es',
        keepOpen: false,
        minDate: current_date
    });

    input_endcredit.datetimepicker('date', input_endcredit.val());

    input_endcredit.on('change.datetimepicker', function(e) {
        fvSale.revalidateField('end_credit');
    });

    $('input[name="dscto"]')
        .TouchSpin({
            min: 0.00,
            max: 100,
            step: 0.01,
            decimals: 2,
            boostat: 5,
            verticalbuttons: true,
            maxboostedstep: 10,
        })
        .on('change touchspin.on.min touchspin.on.max', function() {
            var dscto = $(this).val();
            if (dscto === '') {
                $(this).val('0.00');
            }
            vents.calculate_invoice();
        })
        .keypress(function(e) {
            return validate_decimals($(this), e);
        });




    //id_entrada

    $('#id_entrada').on('change', function() {
        vents.calculate_invoice();
        console.log('llama funcim');


    });







    $('.btnProforma').on('click', function() {
        if (vents.details.products.length === 0) {
            message_error('Debe tener al menos un item en el detalle para poder crear una proforma');
            return false;
        }

        var parameters = {
            'action': 'create_proforma',
            'vents': JSON.stringify(vents.details),

            //agreg
            //'det': fvSale
        };
        console.log('par', parameters);

        $.ajax({
            url: pathname,
            data: parameters,
            type: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            xhrFields: {
                responseType: 'blob'
            },
            success: function(request) {
                if (!request.hasOwnProperty('error')) {
                    var d = new Date();
                    var date_now = d.getFullYear() + "_" + d.getMonth() + "_" + d.getDay();
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style = "display: none";
                    const blob = new Blob([request], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);
                    a.href = url;
                    a.download = "download_pdf_" + date_now + ".pdf";
                    a.click();
                    window.URL.revokeObjectURL(url);
                    return false;
                }
                message_error(request.error);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                message_error(errorThrown + ' ' + textStatus);
            }
        });
    });

    hideRowsVents([{ 'pos': 0, 'enable': true }, { 'pos': 1, 'enable': false }, { 'pos': 2, 'enable': false }]);
});


function miFuncion() {
    console.log('ennnn');
    vents.calculate_invoice();
    vents.list_products();
    vents.calculate_invoice();

    var valest = $('input[name="valest"]').val();
    console.log('xxxxxt', valest);

    var valpago = $('input[name="valpago"]').val();
    console.log('valpago', valpago);


    if (valest == "Pedido") {
        $("#Cancelar").hide();
        $("#Facturar").hide();
        //document.getElementById("id_entrada").setAttribute("readonly", true);
        //input_entrada.prop('disabled', false);
        //$("#id_plazo").select2({ disabled: 'readonly' });

        $("#id_client").select2({ disabled: 'readonly' });

        $("#id_payment_condition").select2({ disabled: 'readonly' });
        //$("#id_plazo").select2({ disabled: 'readonly' });
        $("#id_payment_method").select2({ disabled: 'readonly' });
        $("#id_sucursal").select2({ disabled: 'readonly' });
        $("#id_type_voucher").select2({ disabled: 'readonly' });
        //$("#id_plazo").select2({ disabled: 'readonly' });

        document.getElementById("id_cash").setAttribute("readonly", true);
        //dropdown.setAttribute("disabled", "true");

        $("#tblinformacion").find("input,button,textarea,select").attr("disabled", "disabled");
        //$("#btnAddClient").hide();
        $("#tblProducts").find("input,button,textarea,select").attr("disabled", "disabled");


        $("#bcw").hide();

        //$('#bco').children('div').hide();

        $('#titprofd').children('div').hide();






    }


}