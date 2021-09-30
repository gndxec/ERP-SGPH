import json

from django.contrib.auth.models import Group
from django.db import transaction
from django.http import JsonResponse, HttpResponse
from django.urls import reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView, TemplateView

from config import settings
from core.pos.forms import PriceListForm, PriceList
from core.security.mixins import ModuleMixin, PermissionMixin


class PriceListListView(PermissionMixin, TemplateView):
    template_name = 'crm/pricelist/list.html'
    permission_required = 'view_pricelist'

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search':
                data = []
                for i in PriceList.objects.filter():
                    data.append(i.toJSON())
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['create_url'] = reverse_lazy('pricelist_create')
        context['title'] = 'Listado de Precios'
        return context


class PriceListCreateView(PermissionMixin, CreateView):
    model = PriceList
    template_name = 'crm/pricelist/create.html'
    form_class = PriceListForm
    success_url = reverse_lazy('pricelist_list')
    permission_required = 'add_pricelist'

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'add':
                data = self.get_form().save()
                print('pricelist',data)
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')


    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Nuevo registro de Precio'
        context['action'] = 'add'
        context['instance'] = None
        return context


class PriceListUpdateView(PermissionMixin, UpdateView):
    model = PriceList
    template_name = 'crm/pricelist/create.html'
    form_class = PriceListForm
    success_url = reverse_lazy('pricelist_list')
    permission_required = 'change_pricelist'

    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'edit':
                data = self.get_form().save()
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Edición de un Precios'
        context['action'] = 'edit'
        return context


class PriceListDeleteView(PermissionMixin, DeleteView):
    model = PriceList
    template_name = 'crm/pricelist/delete.html'
    success_url = reverse_lazy('pricelist_list')
    permission_required = 'delete_pricelist'

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