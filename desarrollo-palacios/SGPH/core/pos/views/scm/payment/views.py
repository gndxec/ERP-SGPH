import json

from django.contrib.auth.models import Group
from django.db import transaction
from django.http import JsonResponse, HttpResponse
from django.urls import reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView, TemplateView

from config import settings
from core.pos.forms import PaymentForm, Payment
from core.security.mixins import ModuleMixin, PermissionMixin


class PaymentListView(PermissionMixin, TemplateView):
    template_name = 'scm/payment/list.html'
    permission_required = 'view_payment'

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search':
                data = []
                for i in Payment.objects.filter():
                    data.append(i.toJSON())
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['create_url'] = reverse_lazy('payment_create')
        context['title'] = 'Plazos de Pago'
        return context


class PaymentCreateView(PermissionMixin, CreateView):
    model = Payment
    template_name = 'scm/payment/create.html'
    form_class = PaymentForm
    success_url = reverse_lazy('payment_list')
    permission_required = 'add_payment'

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'add':
                data = self.get_form().save()
                print('payment',data)
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')


    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Nuevo registro de Plazos de Pago'
        context['action'] = 'add'
        context['instance'] = None
        return context


class PaymentUpdateView(PermissionMixin, UpdateView):
    model = Payment
    template_name = 'scm/payment/create.html'
    form_class = PaymentForm
    success_url = reverse_lazy('payment_list')
    permission_required = 'change_payment'

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
        context['title'] = 'Edición de un Plazos de Pago'
        context['action'] = 'edit'
        return context


class PaymentDeleteView(PermissionMixin, DeleteView):
    model = Payment
    template_name = 'scm/payment/delete.html'
    success_url = reverse_lazy('payment_list')
    permission_required = 'delete_payment'

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