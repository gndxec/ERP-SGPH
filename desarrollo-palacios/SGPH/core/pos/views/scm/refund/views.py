import json

from django.contrib.auth.models import Group
from django.db import transaction
from django.http import JsonResponse, HttpResponse
from django.urls import reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView, TemplateView

from config import settings
from core.pos.forms import Refund, RefundForm, Operation, OperationForm
from core.security.mixins import ModuleMixin, PermissionMixin


class RefundListView(PermissionMixin, TemplateView):
    template_name = 'scm/refund/list.html'
    permission_required = 'view_refund'

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search':
                data = []
                print('entra sucursal')
                
                for i in Refund.objects.filter():
                    data.append(i.toJSON())
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['create_url'] = reverse_lazy('refund_create')
        context['title'] = 'Listado de Devoluciones'
        return context


class RefundCreateView(PermissionMixin, CreateView):
    model = Refund
    template_name = 'scm/refund/create.html'
    form_class = RefundForm
    success_url = reverse_lazy('refund_list')
    permission_required = 'add_refund'

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
        context['title'] = 'Nuevo registro de Devolución'
        context['action'] = 'add'
        context['instance'] = None
        return context


class RefundUpdateView(PermissionMixin, UpdateView):
    model = Refund
    template_name = 'scm/refund/create.html'
    form_class = RefundForm
    success_url = reverse_lazy('refund_list')
    permission_required = 'change_refund'

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
        context['title'] = 'Edición de una Devolución'
        context['action'] = 'edit'
        return context


class RefundDeleteView(PermissionMixin, DeleteView):
    model = Refund
    template_name = 'scm/refund/delete.html'
    success_url = reverse_lazy('refund_list')
    permission_required = 'delete_refund'

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