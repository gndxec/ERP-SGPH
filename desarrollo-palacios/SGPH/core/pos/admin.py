#from core.pos.models import Purchase
#from core.pos.models import Sale
#from core.pos.models import SeriesAsignarCompra
from core.pos.models import SerieDetail
from django.contrib import admin
#from core.pos.models import PurchaseRequest
#from core.pos.models import PurchaseRequestDetail


class SerieDetailAdmin(admin.ModelAdmin):
    list_display=(
        'serie',
        'nuserie',

    )
    search_fields = ('nuserie',)

admin.site.register(SerieDetail, SerieDetailAdmin)



# Register your models here.
#class SaleAdmin(admin.ModelAdmin):
#    list_display=(
#        'client',
#        'payment_condition',  
#        'sucursal',  
#        'plazo',
#        'estado',

#    )
#    search_fields = ('client',)

#admin.site.register(Sale, SaleAdmin)




#class SeriesAsignarCompraAdmin(admin.ModelAdmin):
#    list_display=(
#        'id',
#        'numfactpro',
#        'product',  
#        'demanda',  
#        'recibido',
#    )
#    search_fields = ('numfactpro',)

#admin.site.register(SeriesAsignarCompra, SeriesAsignarCompraAdmin)



#class PurchaseRequestDetailAdmin(admin.ModelAdmin):
#    list_display=(
#        'purchaserequest',
#        'product',  
#        'cant',  


#    )
#    search_fields = ('cant',)
#admin.site.register(PurchaseRequestDetail, PurchaseRequestDetailAdmin)




#class PurchaseRequestAdmin(admin.ModelAdmin):
#    list_display=(
#        'id',
#        'state',
#        'sucursal',  


#    )
#    search_fields = ('state',)
#admin.site.register(PurchaseRequest, PurchaseRequestAdmin)
#admin.site.register(Sale, SaleAdmin)





#class PurchaseAdmin(admin.ModelAdmin):
#    list_display=(
#            'provider',
#            'payment_condition',
#            'sucursal',
#            'state'
#)
#admin.site.register(Purchase, PurchaseAdmin)

#PurchaseDetail
#class PurchaseRequestAdmin(admin.ModelAdmin):
#    list_display=(
#        'reference',
#        'date_joined',  
#        'state',  


#    )
#    search_fields = ('reference',)

#admin.site.register(PurchaseRequestAdmin, PurchaseRequest)

