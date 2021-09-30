import json

from django.db import transaction
from django.http import JsonResponse, HttpResponse
from django.urls import reverse_lazy
from django.views.generic import CreateView, DeleteView, FormView, UpdateView

from core.reports.forms import ReportForm
from core.security.mixins import PermissionMixin




from django.contrib.auth.models import Group
from django.db.models import Q
from django.template.loader import get_template
from weasyprint import HTML, CSS

from core.pos.forms import *


class PurchaseSerieListView(PermissionMixin, FormView):
    template_name = 'scm/serie/list.html'
    permission_required = 'view_purchaseorder'
    form_class = ReportForm

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'search':
                data = []
                start_date = request.POST['start_date']
                end_date = request.POST['end_date']
                search = PurchaseRequest.objects.filter(Q(state='Aprobado')|Q(state='Recibido'))

                #search = PurchaseRequest.objects.filter()
                if len(start_date) and len(end_date):
                    search = search.filter(date_joined__range=[start_date, end_date])
                for i in search:
                    data.append(i.toJSON())
            elif action == 'search_detproducts':
                print('entrali')
                data = []
                for det in PurchaseRequestDetail.objects.filter(purchaserequest_id=request.POST['id']):
                    data.append(det.toJSON())
            else:
                data['error'] = 'No ha ingresado una opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['create_url'] = reverse_lazy('purchaseserie_create')
        context['title'] = 'Listado de Ordenes Aprobadas'
        return context


class PurchaseSerieCreateView(PermissionMixin, CreateView):
    model = PurchaseRequest
    template_name = 'scm/serie/create.html'
    form_class = PurchaseRequestForm
    success_url = reverse_lazy('purchaseserie_list')
    permission_required = 'add_purchaseorder'

    def validate_provider(self):
        data = {'valid': True}
        try:
            type = self.request.POST['type']
            obj = self.request.POST['obj'].strip()
            if type == 'name':
                if Provider.objects.filter(name__iexact=obj):
                    data['valid'] = False
            elif type == 'ruc':
                if Provider.objects.filter(ruc__iexact=obj):
                    data['valid'] = False
            elif type == 'mobile':
                if Provider.objects.filter(mobile=obj):
                    data['valid'] = False
            elif type == 'email':
                if Provider.objects.filter(email=obj):
                    data['valid'] = False
        except:
            pass
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        action = request.POST['action']
        data = {}
        try:
            if action == 'add':
                with transaction.atomic():
                    purchaseorder = PurchaseRequest()
                    purchaseorder.provider_id = int(request.POST['provider'])
                    print('provider_id',purchaseorder.provider_id)
                    purchaseorder.payment_condition = request.POST['payment_condition']
                    print('payment_condition',purchaseorder.payment_condition)
                    purchaseorder.date_joined = request.POST['date_joined']
                    print('date_joined',purchaseorder.date_joined)                  
                    purchaseorder.state = "Aprobar"
                    print('state',purchaseorder.state )
                    purchaseorder.concepto = request.POST['concepto']
                    print('concepto',purchaseorder.concepto)
                    purchaseorder.plazo_id = request.POST['plazo']
                    print('plazo_id',purchaseorder.plazo_id)
                    purchaseorder.sucursal_id = request.POST['sucursal']
                    print('sucursal_id',purchaseorder.sucursal_id)
                    purchaseorder.dscto = float(request.POST['dscto'])
                    print('dscto',purchaseorder.dscto)
                    purchaseorder.iva = float(Company.objects.first().iva) / 100
                    print( 'iva',purchaseorder.iva)
                    purchaseorder.total = float(request.POST['total'])
                    print( 'total',purchaseorder.total)
                    purchaseorder.subtotal = float(request.POST['subtotal'])
                    print( 'subtotal',purchaseorder.subtotal)

                    purchaseorder.save()

                    for p in json.loads(request.POST['products']):
                        prod = Product.objects.get(pk=p['id'])

                        det = PurchaseRequestDetail()
                        det.purchaserequest_id = purchaseorder.id
                        print(det.purchaserequest_id)
                        det.product_id = prod.id
                        print(det.product_id)
                        det.cant = int(p['cant'])
                        print(det.cant)
                        det.price = float(p['pricemod'])
                        print(det.price)
                        det.subtotal = det.cant * float(det.price)
                        print(det.subtotal )
                        det.save()

                        det.product.stock += det.cant
                        det.product.save()

                    purchaseorder.calculate_invoice()

                    if purchaseorder.payment_condition == 'credito':
                        purchaseorder.end_credit = request.POST['end_credit']
                        purchaseorder.save()
                        #debtspay = DebtsPay()
                        #debtspay.purchaseorder_id = purchaseorder.id
                        #debtspay.date_joinedorder = purchaseorder.date_joined
                        #debtspay.end_date = purchaseorder.end_credit
                        #debtspay.debt = purchaseorder.subtotal
                        #debtspay.saldo = purchaseorder.subtotal
                        #debtspay.save()
            elif action == 'search_products':
                data = []
                ids = json.loads(request.POST['ids'])
                term = request.POST['term']
                search = Product.objects.filter(category__inventoried=True).exclude(id__in=ids).order_by('name')
                if len(term):
                    search = search.filter(name__icontains=term)
                    search = search[0:10]
                for p in search:
                    item = p.toJSON()
                    item['value'] = '{} / {}'.format(p.name, p.category.name)
                    data.append(item)
            elif action == 'search_provider':
                data = []
                for p in Provider.objects.filter(name__icontains=request.POST['term']).order_by('name')[0:10]:
                    item = p.toJSON()
                    item['text'] = '{} / {}'.format(p.name, p.ruc)
                    data.append(item)
            elif action == 'validate_provider':
                return self.validate_provider()
            elif action == 'create_provider':
                form = ProviderForm(request.POST)
                data = form.save()
            #agrseries
            elif action == 'create_series':
                with transaction.atomic():
                    #form = SeriesCompraForm(request.POST)

                    #series=SeriesCompraForm()
                    #series.numfactpro=request.POST['numfactpro']
                    #print(series.numfactpro)
                    #series.demanda=request.POST['demanda']
                    #print(series.demanda)
                    #series.recibido=request.POST['recibido']
                    #print(series.recibido)
                     
                    data = form.save()
            else:
                data['error'] = 'No ha ingresado una opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['frmProvider'] = ProviderForm()
        context['frmSeries'] = SeriesCompraForm()

        context['iva'] = Company.objects.first().get_iva()
        #context['frmSeries'] = SeriesCompraForm()
        #context['frmClient'] = ClientForm()

        context['list_url'] = self.success_url
        context['title'] = 'Nuevo registro de una Orden de Compra'
        context['action'] = 'add'

        return context


class PurchaseSerieDeleteView(PermissionMixin, DeleteView):
    model = PurchaseRequest
    template_name = 'scm/serie/delete.html'
    success_url = reverse_lazy('purchaseserie_list')
    permission_required = 'delete_purchaseorder'

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


class PurchaseSerieUpdateView(PermissionMixin, UpdateView):
    model = PurchaseRequest    
    template_name = 'scm/serie/create.html'
    form_class = PurchaseRequestForm
    success_url = reverse_lazy('purchaseserie_list')
    permission_required = 'change_purchase'

    def validate_provider(self):
        data = {'valid': True}
        try:
            type = self.request.POST['type']
            obj = self.request.POST['obj'].strip()
            if type == 'name':
                if Provider.objects.filter(name__iexact=obj):
                    data['valid'] = False
            elif type == 'ruc':
                if Provider.objects.filter(ruc__iexact=obj):
                    data['valid'] = False
            elif type == 'mobile':
                if Provider.objects.filter(mobile=obj):
                    data['valid'] = False
            elif type == 'email':
                if Provider.objects.filter(email=obj):
                    data['valid'] = False
        except:
            pass
        return JsonResponse(data)


    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def get_form(self, form_class=None):
        instance = self.get_object()
        form = PurchaseRequestForm(instance=instance)
        #form.fields['client'].queryset = Client.objects.filter(id=instance.client.id)
        return form

    def post(self, request, *args, **kwargs):
        action = request.POST['action']
        data = {}
        try:
            if action == 'edit':
                print('edit')
                with transaction.atomic():
                    #sale = Sale.objects.get(pk=self.get_object().id)
                    purchaseorder = self.get_object()
                    #purchaserequest.date_joined = request.POST['date_joined']
                    #purchaserequest.state = ''
                    #purchaserequest.sucursal_id = request.POST['sucursal']
                    purchaseorder.provider_id = int(request.POST['provider'])
                    print('provider_id',purchaseorder.provider_id)
                    purchaseorder.payment_condition = request.POST['payment_condition']
                    print('payment_condition',purchaseorder.payment_condition)
                    purchaseorder.date_joined = request.POST['date_joined']
                    print('date_joined',purchaseorder.date_joined)                  
                    purchaseorder.state = "Recibido"
                    print('state',purchaseorder.state )
                    purchaseorder.concepto = request.POST['concepto']
                    print('concepto',purchaseorder.concepto)
                    purchaseorder.plazo_id = request.POST['plazo']
                    print('plazo_id',purchaseorder.plazo_id)
                    purchaseorder.sucursal_id = request.POST['sucursal']
                    print('sucursal_id',purchaseorder.sucursal_id)
                    purchaseorder.dscto = float(request.POST['dscto'])
                    print('dscto',purchaseorder.dscto)
                    purchaseorder.iva = float(Company.objects.first().iva) / 100
                    print( 'iva',purchaseorder.iva)
                    purchaseorder.total = float(request.POST['total'])
                    print( 'total',purchaseorder.total)
                    purchaseorder.subtotal = float(request.POST['subtotal'])
                    print( 'subtotal',purchaseorder.subtotal)
                    purchaseorder.save()
                    purchaseorder.purchaserequestdetail_set.all().delete()

                    for i in json.loads(request.POST['products']):
                        prod = Product.objects.get(pk=i['id'])
                        det = PurchaseRequestDetail()
                        det.purchaserequest_id = purchaseorder.id
                        det.product_id = prod.id
                        det.price = float(i['pricemod'])
                        det.cant = int(i['cant'])
                        #det.recb = int(i['recb'])
                        det.subtotal = det.price * det.cant
                        #det.dscto = float(i['dscto']) 
                        #saledetail.total_dscto = saledetail.dscto * saledetail.subtotal
                        det.subtotal = det.cant * float(det.price)                       
                        det.save()

                        #saledetail.product.stock -= saledetail.cant
                        det.product.save()

                    #purchaserequest.calculate_invoice()

                  
                       
                    data = {'id': purchaseorder.id}
            elif action == 'search_products':
                data = []
                ids = json.loads(request.POST['ids'])
                term = request.POST['term']
                search = Product.objects.filter(category__inventoried=True).exclude(id__in=ids).order_by('name')
                if len(term):
                    search = search.filter(name__icontains=term)
                    search = search[0:10]
                for p in search:
                    item = p.toJSON()
                    item['value'] = '{} / {}'.format(p.name, p.category.name)
                    data.append(item)
            elif action == 'search_provider':
                data = []
                for p in Provider.objects.filter(name__icontains=request.POST['term']).order_by('name')[0:10]:
                    item = p.toJSON()
                    item['text'] = '{} / {}'.format(p.name, p.ruc)
                    data.append(item)
            elif action == 'validate_provider':
                return self.validate_provider()
            elif action == 'create_provider':
                form = ProviderForm(request.POST)
                data = form.save()
            elif action == 'create_series':
                with transaction.atomic():
                    seriesasignarcompra = SeriesAsignarCompra()
                    seriesasignarcompra.numfactpro = request.POST['numfactpro']
                    seriesasignarcompra.product = request.POST['product']

                    seriesasignarcompra.demanda = request.POST['demanda']
                    seriesasignarcompra.recibido = request.POST['recibido']
                    



                    seriesasignarcompra.save()
                    print('guarda solicitud')

                    for p in json.loads(request.POST['productos']):
                        print('entra recorre solicitud')
                        print(json.loads(request.POST['productos']))

                        det = SerieDetail()
                        print('iiiid',seriesasignarcompra.id)
                        det.serie_id = seriesasignarcompra.id
                        print('ddc',det.serie_id)
                        print(p)
                        det.nuserie = (p)
                        print('ddcc',det.nuserie)
                        det.save()



     
            else:
                data['error'] = 'No ha ingresado una opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')


    def get_details_product(self):
        data=[]
        try:
            for i in PurchaseRequestDetail.objects.filter(purchaserequest_id=self.get_object().id):
                print('entra valor prod',i)
                item = i.product.toJSON()
                item['cant'] = i.cant
                item['pricemod'] = float(i.price)
                print(item['cant'])
                #item['dscto']= float(i.dscto)
                #print(item)
                data.append(item)

        except:
            pass
        return data



    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['frmProvider'] = ProviderForm()
        context['frmSeries'] = SeriesCompraForm()

        context['title'] = 'Asignación de Serie'
        context['action'] = 'edit'
        context['iva'] = Company.objects.first().get_iva()

        #context['iva'] = Company.objects.first().get_iva()
        context['det'] = json.dumps(self.get_details_product())
        return context

