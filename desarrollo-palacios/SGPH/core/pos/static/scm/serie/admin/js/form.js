var tblProducts;
var tblSearchProducts;
var current_date;

var fvPurchase;
var fvProvider;

var select_provider;
var input_datejoined;
var input_endcredit;
var input_searchproducts;
var inputCredit;

//nuevos campos
var select_plazo;
var select_sucursal;
var inputConcepto;
var fvSeries;


var select_paymentcondition;




var purchase = {
    details: {
        subtotal: 0.00,
        iva: 0.00,
        total_iva: 0.00,
        dscto: 0.00,
        subtotaldos: 0.00,
        total_dscto: 0.00,
        total: 0.00,
        products: [],
    },
    calculate_invoice: function() {
        var total = 0.00;
        console.log('entra calculate_invoice');
        $.each(this.details.products, function(i, item) {
            item.cant = parseInt(item.cant);

            if (item.pricemod == 1) {
                item.pricemod = parseFloat(item.price);

                //console.log('xxxxx', item.pricemod);
                item.cant = parseInt(item.cant);
                item.pricemod = parseFloat(item.pricemod);

                item.subtotal = item.cant * parseFloat(item.pricemod);
                total += item.subtotal;
            }


            if (item.pricemod != parseFloat(item.price)) {
                //console.log('xxxxx', item.pricemod);
                item.cant = parseInt(item.cant);
                item.pricemod = parseFloat(item.pricemod);

                item.subtotal = item.cant * parseFloat(item.pricemod);
                total += item.subtotal;
            }

            if (item.pricemod == parseFloat(item.price)) {
                //console.log('xxxxx', item.pricemod);
                item.cant = parseInt(item.cant);
                item.pricemod = parseFloat(item.pricemod);

                item.subtotal = item.cant * parseFloat(item.pricemod);
                total += item.subtotal;
            }

            //item.subtotal = item.cant * parseFloat(item.pricemod);

            //console.log('cant', item.cant);
            //console.log('pricemod', item.pricemod);
        });
        purchase.details.dscto = parseFloat($('input[name="dscto"]').val());

        purchase.details.subtotal = total;
        $('input[name="subtotal"]').val(purchase.details.subtotal.toFixed(2));
        //console.log('total_iva', purchase.details.total_iva);
        $('input[name="iva"]').val(purchase.details.iva.toFixed(2));
        //console.log('iva', purchase.details.iva.toFixed(2));
        purchase.details.total_dscto = purchase.details.subtotal * (purchase.details.dscto / 100);
        //console.log('descto', purchase.details.dscto);
        //console.log('total_desc', purchase.details.total_dscto);

        purchase.details.subtotaldos = purchase.details.subtotal - purchase.details.total_dscto;
        //console.log('subtotaldos', purchase.details.subtotaldos);

        purchase.details.total_iva = purchase.details.subtotaldos * (purchase.details.iva / 100);
        //console.log('total_iva', purchase.details.total_iva);

        purchase.details.total = purchase.details.subtotaldos + purchase.details.total_iva;
        //console.log('total', purchase.details.total);


        $('input[name="total_iva"]').val(purchase.details.total_iva.toFixed(2));
        $('input[name="total_dscto"]').val(purchase.details.total_dscto.toFixed(2));
        $('input[name="total"]').val(purchase.details.total.toFixed(2));
        $('input[name="subtotaldos"]').val(purchase.details.subtotaldos.toFixed(2));

    },
    list_products: function() {
        this.calculate_invoice();
        tblProducts = $('#tblProducts').DataTable({
            //responsive: true,
            //autoWidth: false,
            destroy: true,
            data: this.details.products,
            ordering: false,
            lengthChange: false,
            searching: false,
            paginate: false,
            scrollX: true,
            scrollCollapse: true,
            columns: [{
                    //defaultContent: "<button type='button' class='asigseries btn btn-primary ' data-toggle='modal' data-target='#myModalSeries'><i class='fas fa-list'></i></button>"
                },

                { data: "name" },
                //{ data: "category.name" },
                { data: "cant" },
                { data: "recb" },
                //{ data: "subtotal" },
            ],
            columnDefs: [{
                    targets: [-2],
                    class: 'text-center',
                    render: function(data, type, row) {
                        return '<input type="text" class="form-control input-sm" style="width: 100px;" autocomplete="off" name="cant" value="' + row.cant + '">';
                    }
                },
                // {
                //     targets: [-1],
                //     class: 'text-center',
                //     render: function(data, type, row) {
                //         return '$' + parseFloat(data).toFixed(2);
                //     }
                // },
                {
                    targets: [-1],
                    class: 'text-center',
                    render: function(data, type, row) {
                        return '<input type="text" class="form-control input-sm" style="width: 100px;" autocomplete="off" name="recb" value="' + row.cant + '">';
                    }
                },
                {
                    targets: [0],
                    class: 'text-center',
                    render: function(data, type, row) {
                        //return '<a  class="btn btn-primary btn-flat btn-xs" ><i class="fas fa-list fa-1x"></i></a>';
                        return '<button rel="asigseries" class="btn btn-primary" type="button" data-toggle="modal" data-target="#myModalSeries"><i class="fas fa-list"></i></button>';
                    }
                },
            ],
            rowCallback: function(row, data, index) {
                var tr = $(row).closest('tr');
                tr.find('input[name="recb"]')
                    .TouchSpin({
                        min: 0,
                        max: 10000000,
                        verticalbuttons: true,
                    })
                    .keypress(function(e) {
                        return validate_form_text('numbers', e, null);
                    });
            },
            //rowCallback: function(row, data, index) {
            //    var tr = $(row).closest('tr');
            //    tr.find('input[name="cant"]')
            //        .TouchSpin({
            //            min: 1,
            //            max: 10000000,
            //            verticalbuttons: true,
            //        })
            //        .keypress(function(e) {
            //            return validate_form_text('numbers', e, null);
            //        });
            //},
            initComplete: function(settings, json) {
                $("[data-toggle='tooltip']").tooltip();
            },

            //rowCallback: function(row, data, index) {
            //var tr = $(row).closest('tr');
            //tr.find('input[name="pricemod"]')

            //.keypress(function(e) {
            //    return validate_decimals('numbers', e, null);
            //});
            //},
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
    }



};

document.addEventListener('DOMContentLoaded', function(e) {
    const frmPurchase = document.getElementById('frmPurchase');
    fvPurchase = FormValidation.formValidation(frmPurchase, {
            locale: 'es_ES',
            localization: FormValidation.locales.es_ES,
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                submitButton: new FormValidation.plugins.SubmitButton(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
                excluded: new FormValidation.plugins.Excluded(),
                icon: new FormValidation.plugins.Icon({
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh',
                }),
            },
            fields: {
                payment_condition: {
                    validators: {
                        notEmpty: {
                            message: 'Seleccione una forma de pago'
                        },
                    }
                },
                provider: {
                    validators: {
                        notEmpty: {
                            message: 'Seleccione un proveedor'
                        },
                    }
                },
                date_joined: {
                    validators: {
                        notEmpty: {
                            message: 'La fecha es obligatoria'
                        },
                        date: {
                            format: 'YYYY-MM-DD',
                            message: 'La fecha no es válida'
                        }
                    }
                },
                end_credit: {
                    validators: {
                        notEmpty: {
                            message: 'La fecha es obligatoria'
                        },
                        date: {
                            format: 'YYYY-MM-DD',
                            message: 'La fecha no es válida'
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
            const iconPlugin = fvPurchase.getPlugin('icon');
            const iconElement = iconPlugin && iconPlugin.icons.has(e.element) ? iconPlugin.icons.get(e.element) : null;
            iconElement && (iconElement.style.display = 'none');
        })
        .on('core.validator.validated', function(e) {
            if (!e.result.valid) {
                const messages = [].slice.call(frmPurchase.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
                messages.forEach((messageEle) => {
                    const validator = messageEle.getAttribute('data-validator');
                    messageEle.style.display = validator === e.validator ? 'block' : 'none';
                });
            }
        })
        .on('core.form.valid', function() {
            var parameters = new FormData($(fvPurchase.form)[0]);
            parameters.append('action', $('input[name="action"]').val());
            parameters.append('end_credit', input_endcredit.val());
            parameters.append('sucursal', select_sucursal.val());
            console.log('sucursal', select_sucursal.val());
            parameters.append('plazo', select_plazo.val());
            console.log('plazo', select_plazo.val());
            parameters.append('concepto', $('input[name="concepto"]').val());
            console.log('concepto', $('input[name="concepto"]').val());

            parameters.append('dscto', $('input[name="dscto"]').val());
            console.log('dscto', $('input[name="dscto"]').val());

            parameters.append('subtotal', $('input[name="subtotal"]').val());
            console.log('subtotal', $('input[name="subtotal"]').val());

            parameters.append('total_dscto', $('input[name="total_dscto"]').val());
            console.log('total_dscto', $('input[name="total_dscto"]').val());

            parameters.append('subtotaldos', $('input[name="subtotaldos"]').val());
            console.log('subtotaldos', $('input[name="subtotaldos"]').val());

            parameters.append('total', $('input[name="total"]').val());
            console.log('total', $('input[name="total"]').val());
            
            
            //parameters.append('select_paymentcondition', $('input[name="id_select_paymentcondition"]').val());
            //console.log('select_paymentcondition', $('input[name="id_select_paymentcondition"]').val());
            
            if (purchase.details.products.length === 0) {
                message_error('Debe tener al menos un item en el detalle');
                return false;
            }
            parameters.append('products', JSON.stringify(purchase.details.products));
            let urlrefresh = fvPurchase.form.getAttribute('data-url');
            submit_formdata_with_ajax('Notificación',
                '¿Estas seguro de realizar la siguiente acción?',
                pathname,
                parameters,
                function() {
                    location.href = fvPurchase.form.getAttribute('data-url');
                },
            );
        });
});

document.addEventListener('DOMContentLoaded', function(e) {
    const frmProvider = document.getElementById('frmProvider');
    fvProvider = FormValidation.formValidation(frmProvider, {
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
                name: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 2,
                        },
                        remote: {
                            url: pathname,
                            data: function() {
                                return {
                                    obj: frmProvider.querySelector('[name="name"]').value,
                                    type: 'name',
                                    action: 'validate_provider'
                                };
                            },
                            message: 'El nombre ya se encuentra registrado',
                            method: 'POST',
                            headers: {
                                'X-CSRFToken': csrftoken
                            },
                        }
                    }
                },
                ruc: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 13
                        },
                        digits: {},
                        remote: {
                            url: pathname,
                            data: function() {
                                return {
                                    obj: frmProvider.querySelector('[name="ruc"]').value,
                                    type: 'ruc',
                                    action: 'validate_provider'
                                };
                            },
                            message: 'El número de ruc ya se encuentra registrado',
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
                            min: 10
                        },
                        digits: {},
                        remote: {
                            url: pathname,
                            data: function() {
                                return {
                                    obj: frmProvider.querySelector('[name="mobile"]').value,
                                    type: 'mobile',
                                    action: 'validate_provider'
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
                                    obj: frmProvider.querySelector('[name="email"]').value,
                                    type: 'email',
                                    action: 'validate_provider'
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
                        // stringLength: {
                        //     min: 4,
                        // }
                    }
                }
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
            const iconPlugin = fvProvider.getPlugin('icon');
            const iconElement = iconPlugin && iconPlugin.icons.has(e.element) ? iconPlugin.icons.get(e.element) : null;
            iconElement && (iconElement.style.display = 'none');
        })
        .on('core.validator.validated', function(e) {
            if (!e.result.valid) {
                const messages = [].slice.call(frmProvider.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
                messages.forEach((messageEle) => {
                    const validator = messageEle.getAttribute('data-validator');
                    messageEle.style.display = validator === e.validator ? 'block' : 'none';
                });
            }
        })
        .on('core.form.valid', function() {
            var parameters = {};
            $.each($(fvProvider.form).serializeArray(), function(key, item) {
                parameters[item.name] = item.value;
            });
            parameters['action'] = 'create_provider';
            submit_with_ajax('Notificación', '¿Estas seguro de realizar la siguiente acción?', pathname,
                parameters,
                function(request) {
                    var newOption = new Option(request.name + ' / ' + request.ruc, request.id, false, true);
                    select_provider.append(newOption).trigger('change');
                    fvPurchase.revalidateField('provider');
                    $('#myModalProvider').modal('hide');
                }
            );
        });
});



//AGREGA SERIES
document.addEventListener('DOMContentLoaded', function(e) {
    const frmSeries = document.getElementById('frmSeries');
    var seriesasig = {
	items: {
		numfactpro:'',
		product:'',
		demanda:'',
		recibido:'',
		productos:[]
		}
	};
    fvSeries = FormValidation.formValidation(frmSeries, {
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
                numfactpro: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 2,
                        },
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
            const iconPlugin = fvSeries.getPlugin('icon');
            const iconElement = iconPlugin && iconPlugin.icons.has(e.element) ? iconPlugin.icons.get(e.element) : null;
            iconElement && (iconElement.style.display = 'none');
        })
        .on('core.validator.validated', function(e) {
            if (!e.result.valid) {
                const messages = [].slice.call(frmSeries.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
                messages.forEach((messageEle) => {
                    const validator = messageEle.getAttribute('data-validator');
                    messageEle.style.display = validator === e.validator ? 'block' : 'none';
                });
            }
        })
        .on('core.form.valid', function() {
            var parameters = new FormData(fvSeries.form);
            console.log('entra producto');


            var resume_table = document.getElementById("tblSerie"); 
            const tableRows = document.querySelectorAll('#tblSerie tr.row');
 
            console.log(resume_table);
            var cantreg=(resume_table.rows.length)+1; 
            console.log(cantreg);   
            //for (var i = 0, cell; cell = resume_table[i]; i++) {
            //    console.log('entra');
                //alert("Valor Celda: " + cell[i].innerText);
            //    console.log("Valor celda",cell[i].innerText);
            //}
            var productos = [];
            var array = new Array;
            //for (var i=1; i<resume_table.rows.length;i++)
            //{ 
                
            //    console.log('valorxxx',resume_table.rows[i].cells[0].innerHTML);
            //    valor_recibido = resume_table.rows[i].cells[0].innerHTML;
            //    array.push(valor_recibido);
            //    console.log('array', array);
            //}

           // var data = tblProducts.row($(this).parents("tr")).data();
           // console.log('entrq', data);
           // console.log('eeee', data.name);

            //tblSerie.rows().every(function(index, element) {
            //    var row = $(this.node());
            //    var statusElement = row.find('td').eq(0); // Index 6 - the 7th column in the table
            //    console.log('elemento',statusElement);
                //var isChecked = statusElement.prop('checked');
                /* ... etc ... */
            //  });
            var valorser='';

            //var table = $('#tblSerie').DataTable();

            var table = $('#tblSerie').DataTable();

            table.rows().every(function(){
            
                var Row=this.data();//store every row data in a variable
            
                console.log(Row[0]);//show Row + Cell index
                console.log('valor',Row[0]);
                valorser=Row[0];
                array.push(valorser);
                console.log('array', array);
            
            });

            for (var o=0; o<array.length;o++){
                console.log('valor del arreglo',array[o]);
            }
            //for(let i=1; i<tblSerie.rows.length; i++){
            //    const row = tableRows[i];
                //var rowx = $(this.node());
                //const serias = row.querySelector('.serieag');
            //    valor_recibido = tblSerie.rows[i][0];
                //var statusElement = rowx.find('td').eq(0);
                //console.log('Estadox: ', statusElement);
                //valor_rs = tblSerie.Rows[i][1];

            //    console.log('Estado: ', valor_recibido);
                //console.log('Estadors: ', valor_rs);


            //    array.push(valor_recibido);
            //    console.log('array', array);
            //}
             
            //for (var o=0; o<array.length;o++){
            //    console.log('valor del arreglo',array[o]);
            //}
            
            //console.log('entra products',JSON.stringify(seriesasig.items.productos));
            parameters.append('action', 'create_series');
            console.log('dddd');
            parameters.append('numfactpro', $('input[name="numfactpro"]').val());
            console.log('numfactpro', $('input[name="numfactpro"]').val());
            parameters.append('product', $('input[name="product"]').val());
            console.log('product', $('input[name="product"]').val());
            parameters.append('demanda', $('input[name="demanda"]').val());
            console.log('demanda', $('input[name="demanda"]').val());
            parameters.append('recibido', $('input[name="recibido"]').val());
            console.log('recibido', $('input[name="recibido"]').val());
            //if (seriesasig.items.productos.length === 0) {
            if (cantreg <= 1) {
                console.log('entra a igual a uno');
                message_error('Debe tener al menos un item en el detalle');
                return false;
            }
            let urlrefresh = fvSeries.form.getAttribute('data-url');
            //parameters.append(JSON.stringify(array));
            console.log('ccc',JSON.stringify(array));
            parameters.append('productos', JSON.stringify(array));
            console.log('entra a action de create');
            submit_formdata_with_ajax('Notificación', '¿Estas seguro de realizar la siguiente acción?', pathname,
                parameters,
                function(request) {
                   
                    $('#myModalSeries').modal('hide');
                }
            );
        });
});



$(function() {

    inputCredit = $('.inputCredit');
    current_date = new moment().format("YYYY-MM-DD");
    input_datejoined = $('input[name="date_joined"]');
    input_endcredit = $('input[name="end_credit"]');
    select_provider = $('select[name="provider"]');
    input_searchproducts = $('input[name="searchproducts"]');
    select_paymentcondition = $('select[name="payment_condition"]');

    select_sucursal = $('select[name="sucursal"]');
    //console.log('dddd', select_sucursal);

    select_plazo = $('select[name="plazo"]');
    //console.log('dddd', select_plazo);
    //select_plazo = $('select[name="plazo"]');

    $('.select2').select2({
        theme: 'bootstrap4',
        language: "es",
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
            //console.log('entra desc');
            var dscto = $(this).val();
            //console.log('entra dscto val', dscto);
            purchase.calculate_invoice();
        })
        .keypress(function(e) {
            return validate_decimals($(this), e);
        });



    /* Products */

    input_searchproducts.autocomplete({
        source: function(request, response) {
            $.ajax({
                url: pathname,
                data: {
                    'action': 'search_products',
                    'term': request.term,
                    'ids': JSON.stringify(purchase.get_products_ids()),
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
            ui.item.cant = 1;
            ui.item.recb = 0;

            purchase.add_product(ui.item);
            $(this).val('').focus();
        }
    });

    $('.btnClearProducts').on('click', function() {
        input_searchproducts.val('').focus();
    });

    $('#tblProducts tbody')
        .on('change', 'input[name="cant"]', function() {
            var tr = tblProducts.cell($(this).closest('td, li')).index();
            purchase.details.products[tr.row].cant = parseInt($(this).val());
            //console.log(parseInt($(this).val()));
            //console.log('cant vvv');
            purchase.calculate_invoice();
            $('td:eq(5)', tblProducts.row(tr.row).node()).html('$' + purchase.details.products[tr.row].subtotal.toFixed(2));
        })
        .on('change', 'input[name="recb"]', function() {
            var tr = tblProducts.cell($(this).closest('td, li')).index();
            purchase.details.products[tr.row].recb = parseFloat($(this).val());
            //console.log(parseFloat($(this).val()));
            //console.log('moooo');
            //purchase.calculate_invoice();
            //$('td:eq(5)', tblProducts.row(tr.row).node()).html('$' + purchase.details.products[tr.row].subtotal.toFixed(2));
        })











    .on('click', 'button[rel="asigseries"]', function() {


        //var name = $("#frmSeries #recibido").val(0);
        //var name = $("#frmSeries #serie").val(0);
        const llenarTabla = document.querySelector('#tblSerie tbody');

        while (llenarTabla.firstChild) {
            llenarTabla.removeChild(llenarTabla.firstChild);
        }


        var data = tblProducts.row($(this).parents("tr")).data();
        console.log('entrq', data);
        console.log('eeee', data.name);
        //var name = $("#frmSeries #name").val(data.name);
        

        let recibidoserx = document.getElementById('id_recibido');
        
        let nameproduct = document.getElementById('id_product');
        nameproduct.value = data.name;
        console.log('prod', nameproduct.value);
        data.recb = data.cant;
        console.log('d',data.recb);



        //var name = $("#frmSeries #demanda").val(data.cant);
        let demandaser = document.getElementById('id_demanda');
        demandaser.value = data.cant;
        console.log('dem', demandaser.value);
        
        //console.log('aaax', name);
        //var name = $("#frmSeries #recibido").val(data.cant);
        let recibidoser = document.getElementById('id_recibido');
        recibidoser.value = data.cant;
        console.log('rec', recibidoser.value);


        var cant = data.cant;
        var modcantidad=cant+1;
        console.log('vmc', modcantidad);
        console.log('cant',cant);

        var cantvs = '';


        //SERIES 
        var barcode ='';
        var interval;
        var _recibido = 1;

        var cant = $(this).parents("tr").find('#serieag').val();

        var nameserw = $("#frmSeries #recibido").val(data.cant);
        if(nameserw !=0){        
            document.addEventListener('keydown', function(evt){

                console.log('sssss');
                if(interval)
                    console.log('sssss2');
                    clearInterval(interval);
                if(evt.code == 'Enter'){
                    console.log('sssss3');
                    console.log('barcode',barcode);
                    //llama funcion
                    //recorre();

                    var table = document.getElementById("tblSerie"),maxVal;
                    //maxVal = barcode;
                    console.log('mzx', typeof(maxVal));
                    //console.log('mtttttzx', table.rows.length);
                    var compnum=barcode;
                    var cantreg=table.rows.length;
                    console.log('xxccc',cantreg);
                    for (var i=1; i<table.rows.length;i++)
                    {   
                        console.log('entra dor',i);
                        console.log('mtttttzx', table.rows.length);

                        if(i>=1){
                            console.log('ent i');
                            console.log('xxx',compnum);
                            console.log('xxxt',table.rows[i].cells[0].innerHTML);

                            if(table.rows[i].cells[0].innerHTML==compnum){
                                console.log('igualeeeeesssss');
                                barcode='';
                                $('#frmSeries')[0].reset();
                                let nameproduct = document.getElementById('id_product');
                                nameproduct.value = data.name;
                                let demandaser = document.getElementById('id_demanda');
                                demandaser.value = data.cant;
                                let recibidoser = document.getElementById('id_recibido');
                                recibidoser.value = data.cant;
                                //console.log('aaax', name);
                                //table.rows[i].cells[0].remove().draw();
                                //var data = tblSerie.row($(this).parents("tr")).data();

                                table.row(':eq(i)').remove().draw();
                                //var row = oTable.find('tr').eq(3);
                                //oTable.fnDeleteRow(row[0]);
                                //$("tr").eq(i).remove();

                                //message_error('Las series no deben ser iguales');

                                //document.getElementById("#serie").reset();
                            }
                            
                            if(cantreg> modcantidad){
                                console.log('eee', cantreg);
                                console.log('cant', cant);
                                console.log('eeeerrrror');
                                barcode='';
                                $('#frmSeries')[0].reset();
                                //var name = $("#frmSeries #name").val(data.name);
                                //var name = $("#frmSeries #demanda").val(data.cant);
                                //console.log('aaax', name);
                                //var name = $("#frmSeries #recibido").val(data.cant);
                                let nameproduct = document.getElementById('id_product');
                                nameproduct.value = data.name;
                                let demandaser = document.getElementById('id_demanda');
                                demandaser.value = data.cant;
                                let recibidoser = document.getElementById('id_recibido');
                                recibidoser.value = data.cant;

                                table.row(':eq(i)').remove().draw();


                            }
                            //var _tr = '<tr><td>' + barcode + '</td>  <td>' + _recibido + '</td>   <td><button type="button" class="btn btn-danger btn-xs btn-delete"><i class="fa fa-trash fa-1x"></i></button></td></tr>';
                            //$("#tblSerie > tbody").append(_tr);
            

                        
                            //maxVal = table.rows[i].cells[0].innerHTML;
                        }
                    }
                    //message_error('Debe tener al menos un producto en su detalle');
        
                    console.log('maxVal',maxVal);


                    var _tr = '<tr><td>' + barcode + '</td>  <td><button type="button" class="btn btn-danger btn-xs btn-delete"><i class="fa fa-trash fa-1x"></i></button></td></tr>';
                    $("#tblSerie > tbody").append(_tr);


                    if(barcode)
                        handleBarcode(barcode);
                        console.log('entra',barcode);
                    barcode='';
                    $('#frmSeries')[0].reset();
                    //var name = $("#frmSeries #name").val(data.name);
                    //var name = $("#frmSeries #demanda").val(data.cant);
                    //var name = $("#frmSeries #recibido").val(data.cant);
                    let nameproduct = document.getElementById('id_product');
                    nameproduct.value = data.name;
                    let demandaser = document.getElementById('id_demanda');
                    demandaser.value = data.cant;
                    let recibidoser = document.getElementById('id_recibido');
                    recibidoser.value = data.cant;
                    console.log('entra vacio',barcode);
                    return;
                }
                if (evt.key != 'Shift')
                    console.log('entraaaa shift');
                    barcode += evt.key;
                    console.log('bar',barcode);
                interval = setInterval(()=> barcode ='', 20);
            });
        }


        function handleBarcode(scanned_barcode){
            console.log('sssss4');
            document.querySelector('#id_serie').innerHTML = scanned_barcode;
            //document.querySelector('#frmSeries #serie').innerHTML = scanned_barcode;

            //document.querySelector('#tblSerie #serieag').innerHTML = scanned_barcode;

        }


        $('#tblSerie tfoot')
        .on('change', 'input[name="serieag"]', function() {
            console.log('entra a tb');
            var cantvs = $(this).parents("tr").find('#serieag').val();
            console.log('valor',cantvs);
            $("#serieag").keypress(function (e){
                console.log('entra a ke');
                // y esa tecla es 13 (ENTER)
                if(e.keyCode == 13){
                    console.log('ent k i');
                    // Añadir a la tabla una fila nueva.
                    var _tr = '<tr><td>' + cantvs + '</td>  <td><button type="button" class="btn btn-danger btn-xs btn-delete"><i class="fa fa-trash fa-1x"></i></button></td></tr>';
                    $("#tblSerie > tbody").append(_tr);
                    //$('#tblSerie').append('<tr><td>+ cantvs  +</td></tr>');
                    // Poner el focus en el nuevo input.
                    $('#serieag').last().focus();
                }
                });
            })


        function handleBarcode(scanned_barcode){
            console.log('sssss4');
            document.querySelector('#id_serie').innerHTML = scanned_barcode;
            console.log('asd',document.querySelector('#id_serie').innerHTML);
            //document.querySelector('#tblSerie #serieag').innerHTML = scanned_barcode;

        }


        

        //$(document).ready(function() {
            // Si en la clase mitexto, se pulsa una tecla
        //    $(".serieag").on("keypress",function (e){
              // y esa tecla es 13 (ENTER)
        //      if(e.keyCode == 13){
                // Añadir a la tabla una fila nueva.
        //        $('#tblSerie').append('<tr><td><input type="text" class="serieag" /></td></tr>');
                // Poner el focus en el nuevo input.
        //        $('.serieag').last().focus();
        //      }
        //    });
        //  });

        //$(document).ready(function() {
        //    $("#serieag").keypress(function() {
        //        var dInput = $('input:text[name=serieag]').val();
        //        console.log('valll',dInput);
        //            $('#tblSerie').append('<tr><td><input type="text" class="serieag" id="serieag" name="serieag" /></td></tr>');

                //$(".dDimension:contains('" + dInput + "')").css("display","block");
        //    });
        //});
        





        $(document).on('click', '.btn-delete', function() {
            $(this).closest('tr').remove();
        });
        //var tr = tblProducts.cell($(this).closest('td, li')).index();
        //console.log('dddd', tr);
        //purchase.details.products[tr.row].cant = parseInt($(this).val());
        //console.log('entrabbbb', purchase.details.products[tr.row].name);
        //tblProducts.row(tr.row).remove().draw();
        //purchase.list_products();
        //$('.tooltip').remove();
    })





    .on('click', 'a[rel="remove"]', function() {
        var tr = tblProducts.cell($(this).closest('td, li')).index();
        purchase.details.products.splice(tr.row, 1);
        tblProducts.row(tr.row).remove().draw();
        //purchase.list_products();
        $('.tooltip').remove();
    });



    $(document).ready(() => {
        $('#btnSer').click(function() {
            console.log('entraaaa');


            //var table = $('#tblSerie').DataTable();

            //table.columns().every(function() {
            //    var that = this;
            //    console.log('aquiii', that);

            //    $('input', this.footer()).on('keyup change', function() {
            //        that
            //            .search(this.value)
            //            .draw();
            //    });
            //});

            oTable = $('#tblSerie').dataTable();
            var secondCellArray = [];
            suma = 0;
            $.each(oTable.fnGetData(), function(i, row) {
                secondCellArray.push(row[1]);
                console.log('xcvddd', secondCellArray);
                console.log('eeee');
            })






            //console.log('tt', secondCellArray);
            //var arr = secondCellArray;
            //console.log('arr', arr);
            //secondCellArray.forEach(function(secondCellArray) {
            //    suma += secondCellArray;
            //    console.log('suma', suma);
            //});
            //console.log(suma);











        })

    })


    $('.btnSearchProducts').on('click', function() {
        tblSearchProducts = $('#tblSearchProducts').DataTable({
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
                    'action': 'search_products',
                    'term': input_searchproducts.val(),
                    'ids': JSON.stringify(purchase.get_products_ids()),
                },
                dataSrc: ""
            },
            //paging: false,
            //ordering: false,
            //info: false,
            scrollX: true,
            scrollCollapse: true,
            columns: [
                { data: "name" },
                { data: "category.name" },
                { data: "price" },
                { data: "pvp" },
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
                        if (row.stock > 0) {
                            return '<span class="badge badge-success">' + data + '</span>'
                        }
                        return '<span class="badge badge-warning">' + data + '</span>'
                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    render: function(data, type, row) {
                        return '<a rel="add" class="btn btn-success btn-flat btn-xs"><i class="fas fa-plus"></i></a>'
                    }
                }
            ],
            rowCallback: function(row, data, index) {
                var tr = $(row).closest('tr');
                if (data.stock === 0) {
                    $(tr).css({ 'background': '#dc3345', 'color': 'white' });
                }
            },
        });
        $('#myModalSearchProducts').modal('show');
    });

    $('#myModalSearchProducts').on('shown.bs.modal', function() {
        purchase.list_products();
    });

    $('#tblSearchProducts tbody').on('click', 'a[rel="add"]', function() {
        var row = tblSearchProducts.row($(this).parents('tr')).data();
        row.cant = 1;
        row.recb = 0;

        purchase.add_product(row);
        tblSearchProducts.row($(this).parents('tr')).remove().draw();
    });

    $('.btnRemoveAllProducts').on('click', function() {
        if (purchase.details.products.length === 0) return false;
        dialog_action('Notificación', '¿Estas seguro de eliminar todos los items de tu detalle?', function() {
            purchase.details.products = [];
            purchase.list_products();
        }, function() {

        });
    });

    /* Search Provider */

    select_provider.select2({
            theme: "bootstrap4",
            language: 'es',
            allowClear: true,
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
                        action: 'search_provider'
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
            fvPurchase.revalidateField('provider');
        })
        .on('select2:clear', function(e) {
            fvPurchase.revalidateField('provider');
        });

    $('.btnAddProvider').on('click', function() {
        $('#myModalProvider').modal('show');
    });

    $('#myModalProvider').on('hidden.bs.modal', function() {
        fvProvider.resetForm(true);
    });
    //Serie
    $('#myModalSeries').on('hidden.bs.modal', function() {
        fvSeries.resetForm(true);
    });

    $('input[name="ruc"]').keypress(function(e) {
        return validate_form_text('numbers', e, null);
    });

    $('input[name="mobile"]').keypress(function(e) {
        return validate_form_text('numbers', e, null);
    });

    /* Form */

    select_paymentcondition
        .on('change.select2', function() {
            fvPurchase.revalidateField('payment_condition');
            var id = $(this).val();
            var start_date = input_datejoined.val();
            input_endcredit.datetimepicker('minDate', start_date);
            input_endcredit.datetimepicker('date', start_date);
            inputCredit.hide();
            if (id === 'credito') {
                inputCredit.show();
                //select_plazo.show();
            }
        });



    select_paymentcondition
        .on('change', function() {
            var id = $(this).val();
            //console.log('tpmonto', id);
            if (id == "contado") {
                $('#dpl').children('div').hide();

                //$("#btnAddAmort").hide();
            }
            if (id == "credito") {
                //console.log('ent cred');
                $('#dpl').children('div').show();
                //$("#btnAddAmort").show();
            }
        });




    input_datejoined.datetimepicker({
        format: 'YYYY-MM-DD',
        useCurrent: false,
        locale: 'es',
        orientation: 'bottom',
        keepOpen: false
    });

    input_datejoined.on('change.datetimepicker', function(e) {
        fvPurchase.revalidateField('date_joined');
        input_endcredit.datetimepicker('minDate', e.date);
        input_endcredit.datetimepicker('date', e.date);
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
        fvPurchase.revalidateField('end_credit');
    });

    inputCredit.hide();

});



//window.onload = function miFuncion() {
//  console.log('ennnn');
//  purchase.calculate_invoice();
//  purchase.list_products();
//  purchase.calculate_invoice();

//  var valest = $('input[name="valest"]').val();
//  console.log('xxxxxt', valest);

//var valpago = $('input[name="valpago"]').val();
//console.log('valpago', valpago);


//if (valest == "Aprobar") {
//    console.log('entra por');
//$("#Cancelar").hide();
//$("#Facturar").hide();
//  $("#tblProducts").find("input,button,textarea,select").attr("disabled", "disabled");

//document.getElementById("id_concepto").readOnly = true;
//document.getElementById("id_dscto").readOnly = true;
//document.getElementById("date_joined").readOnly = true;

//disabled="disabled"
//$("#fieldset").attr("disabled", "disabled");

//$("#id_payment_condition").select2({ disabled: 'readonly' });

//$("#id_sucursal").select2({ disabled: 'readonly' });
//$("#id_plazo").select2({ disabled: 'readonly' });

//document.getElementById("id_cash").setAttribute("readonly", true);
//$('#titprofd').children('div').hide();




//$("#bcw").hide();


//$('#titprofd').children('div').hide();






// }


//};
//window.onload = miFuncion;