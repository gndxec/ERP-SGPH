function getData() {
    $('#data').DataTable({
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
            data: {
                'action': 'search'
            },
            dataSrc: ""
        },
        columns: [
            { "data": "id" },
            { "data": "name" },
            { "data": "desc" },
            { "data": "id" },
        ],
        columnDefs: [{
            targets: [-1],
            class: 'text-center',
            orderable: false,
            render: function(data, type, row) {
                var buttons = '<a href="/pos/scm/payment/update/' + row.id + '/" class="btn btn-warning btn-xs btn-flat"><i class="fas fa-edit"></i></a> ';
                buttons += '<a href="/pos/scm/payment/delete/' + row.id + '/" class="btn btn-danger btn-xs btn-flat"><i class="fas fa-trash-alt"></i></a>';
                return buttons;
            }
        }, ],
        initComplete: function(settings, json) {

        }
    });
}

$(function() {
    getData();
});