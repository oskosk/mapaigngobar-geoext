Ext.namespace('IGN.searchPanel', 'IGN.searchResultRecord');
/**
 * @class IGN.searchResultRecord
 * @author osk
 * Tipo de record utilizado para los resultados de búsqueda
 */
IGN.searchResultRecord = Ext.data.Record.create([
	'title',
	'longDescription',
	'lat',
	'lon',
	'minx',
	'miny',
	'maxx',
	'maxy',
	/**
	 * El marker que representa al record en el mapa
	 * Seteada por el manager de mediciones (@link IGN.searchResultsManager)
	 */
	{name:'marker',type:'auto'},
	/** La clase de resultado de búsqueda para
	 * siempre 'toponymy' para estos resultados
	 */
	'class'
]);

/**
 * @class IGN.searchPanel
 * @extends Ext.Panel
 * Panel de búsqueda de topónimos. Presenta un Ext.ux.SearchField
 * y un Ext.DataView en el cual se despliegan los resultados
 * de la búsqueda de acuerdo a la query del SearchField
 * @author OSK
 */
IGN.searchPanel = Ext.extend(Ext.Panel, {
	html:'<div class="searchtip">Busque lugares o capas de información dentro de los servidores conocidos.<br/><a href="/doc/#11" target="_igndoc">Más información</a></div>',
	/** 
     * Configura una Ext.DataView y un Ext.JsonStore
     * para obtener lo resultados de búsqueda de topónimos
     */
	initComponent: function() {
		this.addEvents(
			/**
			 * @event searchTriggered
			 * Disparado cuando se gatilla el trigger de búsqueda
			 */			
			'searchTriggered'
		);
		/**
		 * @property DataView
		 * @type Ext.DataView
		 * @class IGN.searchPanel.DataView
		 * @extends Ext.DataView
		 * 
		 * Es la DataView que recibe los resultados de la búsqueda.
		 * Presenta en cada Record un link de Agergar al Mapa
		 */
		this.DataView = new Ext.DataView({
			tpl:  '<div>'+
				'<tpl for=".">'+
				'<div class="search-item {class} x-unselectable">'+
					'<h3>{title}</h3>'+
					'<span class="search-item-snippet">{longDescription}</span><br/>'+
					'<span>{servername}</span>'+
					'<div class="addLink"><img src="http://mapa.ign.gob.ar/img/ext/default/s.gif"></div>'+					
				'</div></tpl></div>',
			/**
			 * El Store que guarda los rsultados de las búsqueda
			 * en el serviciod de nomenclator
			 * @type Ext.dataJsonStore
			 */ 
			store: new Ext.data.Store(),
			emptyText:'No se encontraron coincidencias',
			loadingText:'Cargando...',
			autoWidth:true,
			itemSelector: 'div.search-item',
			singleSelect:true
		});
		
		this.DataView.addEvents(

            /**
             * @event recordrecordclicked
             * Generado cuando se clickea un record
             * pero no el link de "Agregar al mapa".
			 * @param object {Ext.data.Record} el Record seleccionado en la DataView
			 * @param event {Mixed} El objeto de evento que se generó
             */
			'recordclicked',
            /**
             * @event addbuttonclicked
             * Generado cuando se clickea el
             * link de "Agregar al mapa".
             * El link se identifica por la clase CSS <i>.addLink</i>
             * @param object {Ext.data.Record} El Record seleccionado en la DataView
			 * @param event {Mixed} El objeto de evento que se generó
			 */
			'addbuttonclicked',
            /**
             * @event removebuttonclicked
             * Generado cuando se clickea el link
             * de "Quitar del mapa".
             * El link se identifica por la clase CSS <i>.removeLink</i>
             * @param object {Ext.data.Record} El Record seleccionado en la DataView
			 * @param event {Mixed} El objeto de evento que se generó
             */
			'removebuttonclicked',
			'hideclicked'
		);
		this.DataView.on({
			'click': function(DataView, index, node, e)
			{
				if ( Ext.fly(e.getTarget()).hasClass('addLink') ) {
					e.stopEvent();
					var record = DataView.getSelectedRecords()[0];
					this.DataView.fireEvent('addbuttonclicked', record, e);
					return true;
				} else if ( Ext.fly(e.getTarget()).hasClass('removeLink') ) {
					var record = DataView.getSelectedRecords()[0];
					this.DataView.fireEvent('removebuttonclicked', record, e);
					return true;
				} else {
					e.stopEvent();
					var record = DataView.getSelectedRecords()[0];
					this.DataView.fireEvent('recordclicked', record, e);
				}
				return true;
			}.createDelegate(this)
		});

		this.searchField = new Ext.form.TriggerField({
			triggerClass:'x-form-search-trigger',
			hideTrigger:true,
			autoWidth:true,
			/**
			 * Al clickearse el trigger
			 * disparo el evento searchTriggered
			 * que el contentManager debería escuchar
										 */
			onTriggerClick: function() {
				this.fireEvent('searchTriggered', this.searchField.getRawValue());
			}.createDelegate(this),
			/**
			 * Para hacer que el enter gatille el método
			 * onTriggerClick
						   */
			listeners: {
				'specialkey': function(f, e) {
					 if(e.getKey() == e.ENTER){
						this.searchField.onTriggerClick();
					}
				}.createDelegate(this)
			}
		});
		
		Ext.apply(this, {
			autoScroll:true,
			items: this.DataView,
			tbar: [
				this.searchField
			],
			listeners: {
				'afterlayout': function() {
					this.searchField.focus();
				}
			}
		});
		IGN.searchPanel.superclass.initComponent.apply(this, arguments);
	}
});
Ext.reg('ign-searchpanel', IGN.searchPanel);
