import json

from django.db import transaction
from django.http import JsonResponse, HttpResponse
from django.urls import reverse_lazy
from django.views.generic import CreateView, DeleteView, FormView

from core.pos.forms import PurchaseForm, Purchase, PurchaseDetail,PurchaseRequestDetail, PurchaseRequest, Product, Provider, DebtsPay, ProviderForm, PurchaseRequestForm,  Operation, OperationForm
from core.reports.forms import ReportForm
from core.security.mixins import PermissionMixin

from django.db.models import Q




class OperationListView(PermissionMixin, FormView):
    model = Operation
    template_name = 'scm/operation/list.html'
    permission_required = 'view_operation'
    form_class = ReportForm

    def post(self, request, *args, **kwargs):
            data = {}
            action = request.POST['action']
            try:
                if action == 'search':
                    data = []
                    start_date = request.POST['start_date']
                    end_date = request.POST['end_date']
                    search = Operation.objects.filter(Q(state='Enviado'))
                    if len(start_date) and len(end_date):
                        search = search.filter(date_joined__range=[start_date, end_date])
                    for i in search:
                        data.append(i.toJSON())
                elif action == 'search_detproducts':
                    print('entrali')
                    data = []
                    for det in OperationDetail.objects.filter(operation_id=request.POST['id']):
                        data.append(det.toJSON())
                else:
                    data['error'] = 'No ha ingresado una opción'
            except Exception as e:
                data['error'] = str(e)
            return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['create_url'] = reverse_lazy('operation_create')
        context['title'] = 'Transferencia de Mercaderia'
        return context
#--------------------------------------------------------------------------------------------------------------------------------------------------------------


class OperationCreateView(PermissionMixin, CreateView):
    model = Operation
    template_name = 'scm/operation/create.html'
    form_class = OperationForm
    success_url = reverse_lazy('operation_list')
    permission_required = 'add_operation'

    def post(self, request, *args, **kwargs):
        action = request.POST['action']
        data = {}
        try:
            if action == 'add':
                with transaction.atomic():
                    #print('entra compra')
                    operation = Operation()
                    operation.date_joined = request.POST['date_joined']
                    operation.observacion=request.POST['observacion']
                    operation.employee_id = request.user.id

                    #print('d',purchaserequest.date_joined)
                    #purchaserequest.reference = request.POST['reference']
                    operation.state = "Transferencia Realizada"
                    operation.sucorigen_id = request.POST['sucorigen']
                    operation.sucdestino_id = request.POST['sucdestino']
                    #print('cv',purchaserequest.sucursal_id)
                    #purchaserequest.reference = request.POST['id']
                    #print('cvv',purchaserequest.reference)




                    operation.save()

                    for p in json.loads(request.POST['products']):
                        prod = Product.objects.get(pk=p['id'])
                        det = OperacionDetail()
                        det.operation_id = operation.id
                        #print('ddc',det.purchaserequest_id)
                        det.product_id = prod.id
                        det.cant = int(p['cant'])
                        #print('ddcc',det.cant)
                        #det.price = float(p['price'])

                        #det.price = float(p['price'])
                        #det.subtotal = det.cant * float(det.price)
                        det.save()

                        #det.product.stock += det.cant
                        det.product.save()

                    #purchaserequest.calculate_invoice()

            elif action == 'search_products':
                data = []
                ids = json.loads(request.POST['ids'])
                term = request.POST['term']
                #print('entra a buscar',term)
                search = Product.objects.filter(category__inventoried=True).exclude(id__in=ids).order_by('name')
                if len(term):
                    search = search.filter(name__icontains=term)
                    search = search[0:10]
                for p in search:
                    item = p.toJSON()
                    item['value'] = '{} / {}'.format(p.name, p.category.name)
                    data.append(item)
            
            else:
                data['error'] = 'No ha ingresado una opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Nuevo registro de una transferencia'
        context['action'] = 'add'
        return context

#--------------------------------------------------------------------------------------------------------------------------------------------------
class OperationDeleteView(PermissionMixin, DeleteView):
    model = Operation
    template_name = 'scm/operation/delete.html'
    success_url = reverse_lazy('operation_list')
    permission_required = 'delete_operation'

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

        

          
      		       
            
                    
                    
     	       
     	          
     	               
     	          
     	          

	     	     
     	     
