var groups = [
    [46,'UTI'],[48,'guti y yo'],[49,''],[50,'grupo super'],[53,'']
];
 
    var userEmail = 'oskosk@gmail.com';
	


	
IGN.objectsPanel = Ext.extend(Ext.Panel, {
	/**
	 * Inicializa con Ext.apply el layout del viewport
	 * @method initComponent
	 */
	initComponent: function () {
		Ext.apply(this, {
			items: [
				buildForm()
			]
		});
		measureAreaControl = new OpenLayers.Control.Measure(
			OpenLayers.Handler.Polygon,
			{
				persist: true,
				title: 'Demarcar Área',
				measure: handleameEsta
			}
		);
		IGN.objectsPanel.superclass.initComponent.apply(this, arguments);
	}
});





function buildForm()
{
	markersLayer = Ext.getCmp('mapPanel').map.getLayersByName('Marcadores temporales')[0];
    var store = new Ext.data.ArrayStore({
        fields: ['id', 'name'],
        data: groups
    });
    
    var form = new Ext.FormPanel({
    labelWidth: 100,
    id: 'form',
    url: 'HandleMetadata.php',
    frame: true,
    title: 'Crear metadatos',
    width: 350,
    defaultType: 'textfield',
    standardSubmit: true,
    autoScroll: true,
	unstyled:true,
    items: [
		new Ext.form.ComboBox({
        width: 180,
        fieldLabel: 'Grupo',
        typeAhead: true,
        mode: 'local',
        forceSelection: false,
        // triggerAction: 'all',
        selectOnFocus:true,
        emptyText:'Nombre del grupo',
        store: store,
        valueField: 'id',
        displayField:'name',
        hiddenName: 'group_id',
        listeners: {
            "blur": {
                fn: function() {
                    var group_name = Ext.get('group_name');
                    group_name.dom.value = this.lastQuery;
                }
            }
        }
      }), new Ext.form.Hidden({
          name: 'group_name',
          id: 'group_name'
      }),
      new Ext.Panel({
          id: 'pnlKeyValueData',
          layout: 'form',
          autoScroll: true,
          items: [
              {
                fieldLabel: 'Nombre',
                xtype: 'textfield',
                name: 'metadata_key',
                id: 'metadata_key',
                allowBlank: false,
                width: 180
              },
              {
                  id: 'metadata_value',
                fieldLabel: 'Descripción',
                name: 'metadata_value',
                allowBlank: false,
                xtype: 'textarea',
                width: 180,
                height: 100
              }
          ]
      }),
      new Ext.Panel({
          id: 'pnlDublinCore',
          hidden: true,
          layout: 'form',
          autoScroll: true,
          items: [
              {
                xtype: 'textfield',
                fieldLabel: 'Título',
                name: 'dc_title',
                allowBlank: true,
                width: 180
              },
              {
                xtype: 'textfield',
                fieldLabel: 'Claves',
                name: 'dc_subject',
                allowBlank: true,
                width: 180
              },
              {
                xtype: 'textarea',
                fieldLabel: 'DescripciÃ³n',
                name: 'dc_description',
                allowBlank: true,
                width: 180
              },
              {
                xtype: 'textfield',
                fieldLabel: 'Fuente',
                name: 'dc_source',
                allowBlank: true,
                width: 180
              },
              {
                xtype: 'textfield',
                fieldLabel: 'Idioma',
                name: 'dc_language',
                allowBlank: true,
                width: 180
              },
              {
                xtype: 'textfield',
                fieldLabel: 'RelaciÃ³n',
                name: 'dc_relation',
                allowBlank: true,
                width: 180
              },
              {
                xtype: 'textfield',
                fieldLabel: 'Cobertura',
                name: 'dc_coverage',
                allowBlank: true,
                width: 180
              },
              {
                xtype: 'textfield',
                fieldLabel: 'Autor / Creador',
                name: 'dc_creator',
                allowBlank: true,
                width: 180
              },
              {
                xtype: 'textfield',
                fieldLabel: 'Editor',
                name: 'dc_publisher',
                allowBlank: true,
                width: 180
              },
              {
                xtype: 'textfield',
                fieldLabel: 'Otros Colaboradores',
                name: 'dc_contributor',
                allowBlank: true,
                width: 180
              },
              {
                xtype: 'textfield',
                fieldLabel: 'Derechos',
                name: 'dc_rights',
                allowBlank: true,
                width: 180
              },
              {
                xtype: 'datefield',
                fieldLabel: 'Fecha',
                name: 'dc_date',
                allowBlank: true,
                width: 180
              },
              {
                xtype: 'textfield',
                fieldLabel: 'Tipo del recurso',
                name: 'dc_type',
                allowBlank: true,
                width: 180
              },
              {
                xtype: 'textfield',
                fieldLabel: 'Formato',
                name: 'dc_format',
                allowBlank: true,
                width: 180
              },
              {
                xtype: 'textfield',
                fieldLabel: 'Identificador',
                name: 'dc_identifier',
                allowBlank: true,
                width: 180
              }
          ]
      }),
      new Ext.form.NumberField({
            hideMode: 'display',
            fieldLabel: 'Latitud',
            name: 'lat',
            id: 'lat',
            allowDecimals: true,
            allowNegative: true,
            decimalPrecision: 12,
            maxValue: 90,
            minValue: -90,
            minText: 'minimo',
            maxText: 'maximo',
            allowBlank: false,
            width: 180
          }),
      new Ext.form.NumberField({
        fieldLabel: 'Longitud',
        name: 'lng',
        id: 'lng',
        allowDecimals: true,
        allowNegative: true,
        decimalPrecision: 12,
        maxValue: 90,
        minValue: -90,
        minText: 'minimo',
        maxText: 'maximo',
        allowBlank: false,
        width: 180
       }),
       new Ext.Panel({
            id: 'pnlArea',
            title: 'Puntos del Ã¡rea seleccionada',
            hidden: true,
            items: [{
                xtype: 'textarea',
                id: 'txtArea',
                width: 290,
                height: 200,
                disabled: true
            },{
                xtype: 'hidden',
                id: 'points'
            },{
                xtype: 'hidden',
                id: 'type'
            }]
        })
      ],
   region: 'west',
   buttons: [
       //{
       //    enableToggle: true,
       //    text: 'Dublin Core',
       //    id: 'btnDublinCore',
       //    toggleHandler: function(){
       //        var isDublinCore = Ext.getCmp('pnlKeyValueData').isVisible();
       //        Ext.getCmp('pnlKeyValueData').setVisible(!isDublinCore);
       //        Ext.getCmp('pnlDublinCore').setVisible(isDublinCore);
       //
       //        Ext.apply(Ext.getCmp('metadata_key'), {allowBlank: isDublinCore });
       //        Ext.apply(Ext.getCmp('metadata_value'), {allowBlank: isDublinCore });
       //    }
       //},
       {
           enableToggle: true,
           text: 'Varios puntos',
           id: 'btnMarcarPuntos',
           toggleHandler: function() {
               if (this.pressed) {
                   Ext.getCmp('type').setValue('1');
                   markersLayer.clearMarkers();
                   clickControl.multiple = true;
                   Ext.getCmp('btnMarcarArea').toggle(false);
                   Ext.getCmp('pnlArea').setTitle('Puntos seleccionados');
                   Ext.getCmp('mapPanel').setTitle("Seleccione los puntos a referenciar");
                   Ext.getCmp('lng').hide();
                   Ext.apply(Ext.getCmp('lng'), {allowBlank: true});
                   Ext.getCmp('lng').label.setVisibilityMode(2);
                   Ext.getCmp('lng').label.hide();
                   Ext.getCmp('lat').hide();
                   Ext.apply(Ext.getCmp('lat'), {allowBlank: true});
                   Ext.getCmp('lat').label.setVisibilityMode(2);
                   Ext.getCmp('lat').label.hide();
                   Ext.getCmp('pnlArea').show();
                   Ext.getCmp('txtArea').setValue('');
               }
           }
    },{
           enableToggle: true,
           text: 'Demarcar Ã¡rea',
           id: 'btnMarcarArea',
           toggleHandler: function(){
               if (this.pressed)
               {
                   Ext.getCmp('type').setValue('2');
                   Ext.getCmp('pnlArea').setTitle('Puntos del Ã¡rea seleccionada');
                   Ext.getCmp('mapPanel').setTitle("Seleccione el Ã¡rea a referenciar");
                   Ext.getCmp('lng').hide();
                   Ext.apply(Ext.getCmp('lng'), {allowBlank: true});
                   Ext.getCmp('lng').label.setVisibilityMode(2);
                   Ext.getCmp('lng').label.hide();
                   Ext.getCmp('lat').hide();
                   Ext.apply(Ext.getCmp('lat'), {allowBlank: true});
                   Ext.getCmp('lat').label.setVisibilityMode(2);
                   Ext.getCmp('lat').label.hide();
                   Ext.getCmp('pnlArea').show();
                   Ext.getCmp('txtArea').setValue('');
                   measureAreaControl.activate();
                   Ext.getCmp('btnMarcarPuntos').toggle(false);
               }
               else
               {
                   Ext.getCmp('type').setValue('1');
                   Ext.getCmp('mapPanel').setTitle("Seleccione el punto a referenciar");
                   Ext.getCmp('lng').show();
                   Ext.apply(Ext.getCmp('lng'), {allowBlank: false});
                   Ext.getCmp('lng').label.show();
                   Ext.getCmp('lat').show();
                   Ext.apply(Ext.getCmp('lat'), {allowBlank: false});
                   Ext.getCmp('lat').label.show();
                   Ext.getCmp('pnlArea').hide();
                   measureAreaControl.deactivate();

                   clickControl.multiple = false;
               }
           },
           pressed: false
   },{
       text: 'Guardar',
       handler: function(){
           var basic = form.getForm();

           if (Ext.getCmp('type').getValue() == '1')
           {
               Ext.getCmp('points').setValue(Ext.getCmp('txtArea').getValue().replace(/,/g, '').replace(/\n/g, ' ').replace(/\) \(/g, '),('));
           }
           if (basic.isValid()) {
               if (form.url)
               {
                   basic.getEl().dom.action = form.url;
               }
           basic.submit();
           }
       }
    },{
        text: 'Cancelar'
    }]
  });

  return form;
}
var a = false;
var measureComplete = false;
function handleameEsta(polygon, eventType, a3)
{
    var component;

    if (eventType=="measurepartial")
    {
        if (measureComplete)
        {
            measureComplete = false;
            Ext.getCmp('txtArea').setValue('');
        }

        component = polygon.components[0].components[
            polygon.components[0].components.length > 2  ? polygon.components[0].components.length -2
            : 0];
        var x = component.x;
        var y = component.y;

        var txtArea = Ext.getCmp('txtArea');
        txtArea.setValue(txtArea.getValue()+'('+x+', '+y+')\n');

        return;
    }

    var points = [];

    measureComplete = true;

    for (var i = 0; i < polygon.components.length; i++)
    {
        component = polygon.components[i];
        for (var j = 0; j < component.components.length; j++)
        {
            points.push(component.components[j]);
        }
    }

    Ext.getCmp('points').setValue(points);
}
