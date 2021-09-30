import json

from django.contrib.auth.models import Group
from django.db import transaction
from django.http import JsonResponse, HttpResponse
from django.urls import reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView, TemplateView

from config import settings
from core.pos.forms import Operation, OperationForm, Warehouse, WarehouseForm
from core.security.mixins import ModuleMixin, PermissionMixin


class WarehouseListView(PermissionMixin, TemplateView):
    template_name = 'scm/warehouse/list.html'
    permission_required = 'view_warehouse'

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search':
                data = []
                print('entra sucursal')
                for i in Warehouse.objects.filter():
                    data.append(i.toJSON())
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['create_url'] = reverse_lazy('warehouse_create')
        context['title'] = 'Listado de Bodegas'
        return context


class WarehouseCreateView(PermissionMixin, CreateView):
    model = Warehouse
    template_name = 'scm/warehouse/create.html'
    form_class = WarehouseForm
    success_url = reverse_lazy('warehouse_list')
    permission_required = 'add_warehouse'

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'add':
                data = self.get_form().save()
                print('sucursal',data)
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')


    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Nuevo registro de Bodega'
        context['action'] = 'add'
        context['instance'] = None
        return context


class WarehouseUpdateView(PermissionMixin, UpdateView):
    model = Warehouse
    template_name = 'scm/warehouse/create.html'
    form_class = WarehouseForm
    success_url = reverse_lazy('warehouse_list')
    permission_required = 'change_warehouse'

    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'edit':
                print('entra edit')
                data = self.get_form().save()
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Edición de un Bodega'
        context['action'] = 'edit'
        return context


class WarehouseDeleteView(PermissionMixin, DeleteView):
    model = Warehouse
    template_name = 'scm/warehouse/delete.html'
    success_url = reverse_lazy('warehouse_list')
    permission_required = 'delete_warehouse'

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            self.get_object().delete()
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Notificación de eliminación'
        context['list_url'] = self.success_url
        return context