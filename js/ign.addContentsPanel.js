/**
 * @class IGN.addContentsPanel
 * @extends Ext.Panel
 * Panel de listado de capas para previsualizar y/o agregar al mapa.<br/>
 * Presenta un Ext.Combo con los nombres (y url) de los servidores WMS conocidos.
 * Estos nombres y url son cargados desde el webservice layers.
 * También presenta un {@link Ext.DataView} en el cual se despliegan records
 * de las capas del servidor.<br/>
 * Actualmente el store es un {@link GeoExt.data.WMSCapabilitiesStore} que se
 * carga dinámicamente cada vez que se selecciona un servidor diferente en el Combo.
 * @author Oscar López
 */
Ext.namespace('IGN.addContentsPanel');

IGN.addContentsPanel = Ext.extend(Ext.Panel, {
	initComponent: function() {
		this.store = new GeoExt.data.WMSCapabilitiesStore({
				url: IGN.defaultCapabilities,
				autoLoad:true
		});

		this.DataView = new Ext.DataView({
			tpl:  '<tpl for=".">'+
				'<div class="search-item">'+
					'<span>Nombre: {name}<?span><br/>'+
					'<span>Título: {title}</span>'+
					'<p>{abstract:ellipsis(50)}</p>'+
					'<p><a class="addLink" href="#">Agregar al mapa</a></p>'+
				'</div></tpl>',
			store: this.store,
			itemSelector: 'div.search-item',
			singleSelect:true

		});
		this.DataView.addEvents(
			'recordclicked',
			'addbuttonclicked',
			'removebuttonclicked',
			'hideclicked'
		);
		this.DataView.on({
			'click': function(DataView, index, node, e)
			{
				if ( Ext.fly(e.getTarget()).hasClass('addLink') ) {
					e.stopEvent();
					var record = DataView.getSelectedRecords()[0];
					this.fireEvent('addbuttonclicked',  record, e);
					return true;
				} else if ( Ext.fly(e.getTarget()).hasClass('removeLink') ) {
					e.stopEvent();
					Ext.fly(e.getTarget()).toggle();
					var record = DataView.getSelectedRecords()[0];
					this.fireEvent('removebuttonclicked', record, e);
					return true;
				} else {
					e.stopEvent();
					var record = DataView.getSelectedRecords()[0];
					this.fireEvent('recordclicked', record, e);
				}
				return true;
			}
		});
		var store2 = new Ext.data.JsonStore({
			url: IGN.BASEURL + 'webservice/servers.getWellknown',
			fields: ['title','url'],
			root: 'results'
		});
		
		store2.load();
		
		this.combo = new Ext.form.ComboBox({
			store: store2,
			displayField:'title',
			//typeAhead: true,
			mode: 'local',
			forceSelection: true,
			triggerAction: 'all',
			emptyText:'Servidores WMS Conocidos...',
			selectOnFocus:true,
			listeners: {
				'select': function(combo,record,index) 
				{
					this.DataView.getStore().destroy();
					this.store = new GeoExt.data.WMSCapabilitiesStore({
						url: OpenLayers.ProxyHost + escape(record.get('url'))
					});
					this.store.load();
					
					this.DataView.bindStore(this.store);
				}.createDelegate(this)
			}
		});

		Ext.apply(this, {
			autoScroll:true,
			items:[this.combo,this.DataView]
		});

		IGN.addContentsPanel.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('ign-addcontentspanel', IGN.addContentsPanel);
