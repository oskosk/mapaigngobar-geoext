Ext.namespace('IGN.measurementsWindow');
Ext.namespace('IGN');
/**
 * @class IGN.searchResultRecord
 * @author osk
 * Tipo de record utilizado para los resultados de búsqueda
 */
IGN.measurementRecord = Ext.data.Record.create([
	/**
	 * El título a mostrar en el panel de contenido.
	 * Defaults to 'Medición'
	 */
	'title',
	/**
	 * El tipo de medición 'length' o 'area'
	 */
	'type',
	/**
	 * El evento 'fuente' que generó la medición
	 */
	'source',
	/**
	 * La medida
	 */
	'measure',
	/**
	 * La unidad de medida
	 */
	'units',
	/**
	 * La feature que representa al record en el mapa
	 * Seteada por el manager de mediciones (@link IGN.measurementsMgr)
	 */
	'feature'
]);
/**
 * @class IGN.measurementsWindow
 * @extends Ext.Window
 * @author OSK
 */
IGN.measurementsWindow = Ext.extend(Ext.Panel, {
	closeAction: 'hide',
	autoScroll:true,
	/**
	 * @property TempRecord
	 * El record temporal generado para la última medición
	 */
	tempRecord:false,
	initComponent: function()
	{
		var toggleGroup = "Controles de Medición";
		this.addEvents(
			/**
			 * @event lengthadded
			 * Disparado cuando el usuario
			 * termina de hacer una medición
			 * de distancia
			 * @param {IGN.measurementRecord} record El record
			 * generado con la medición temporal
			 * @param {event} evt El objeto de evento que recibe
			 * el handler del OpenLayers.Control.Measure al terminar
			 * la medición en el evento 'measure'
			 */
			'lengthadded',
			/**
			 * @event lengthadded
			 * Disparado cuando el usuario
			 * termina de hacer una medición
			 * de área.
			 * @param {IGN.measurementRecord} record El record
			 * generado con la medición temporal
			 * @param {event} evt El objeto de evento que recibe
			 * el handler del OpenLayers.Control.Measure al terminar
			 * la medición en el evento 'measure'
			 */
			'areaadded',
			/**
			 * @event addbuttonclicked
			 * Disparado cuando se clickea
			 * el botón de 'Agregar al mapa'
			 * @param {IGN.measurementRecord} record El record
			 * generado con la medición temporal
			 */
			'addbuttonclicked'
		);
	    Ext.apply(this,{
		listeners: {
		    'hide': function() {
			this.length.deactivate();
			this.area.deactivate();
		    },
			'added': function() {
				this.map.addControl(this.length);
				this.map.addControl(this.area);
			}
		},
		length : new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
			geodesic:true,
		    eventListeners: {
			measure: function(evt) {
			    this.update("Distancia: " + Ext.util.Format.number(evt.measure,'0.000,00/i') + ' ' + evt.units);
				this.tempRecord = new IGN.measurementRecord({
					title: 'Distancia ' + Ext.util.Format.number(evt.measure,'0.000,00/i') + ' ' + evt.units,
					type: 'length',
					measure: evt.measure,
					units: evt.units,
					source: evt
				});
				this.length.deactivate();
				this.topToolbar.measureLengthButton.toggle();
				this.fireEvent('lengthadded', this.tempRecord, evt);
				
			}.createDelegate(this)
		    }
		}),
		area : new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, {
			geodesic:true,
		    eventListeners: {
			measure: function(evt) {
			    this.update("Área: " + Ext.util.Format.number(evt.measure,'0.000,00/i') + ' ' + evt.units + '<sup>2</sup>');
				this.tempRecord = new IGN.measurementRecord({
					title: 'Área ' + Ext.util.Format.number(evt.measure,'0.000,00/i') + ' ' + evt.units + '<sup>2</sup>',
					type: 'area',
					measure: evt.measure,
					units: evt.units,					
					source: evt
				});
				this.area.deactivate();
				this.topToolbar.measureAreaButton.toggle();
				this.fireEvent('areaadded', this.tempRecord, evt);
			}.createDelegate(this)
		    }
		}),
		tbar: {
			enableOverflow: true,
			items: [{
				text: 'Medir distancia',
				ref: 'measureLengthButton',
				tooltip: 'Haga clic sobre el mapa para marcar los vértices' +
				'nodos de un camino de varios segmentos.' +
				' Haga doble clic para finalizar la medición.',
				enableToggle: true,
				toggleGroup: toggleGroup,
				handler: function(toggled){
					if (toggled) {
						this.length.activate();
					} else {
						this.length.deactivate();
					}
				}.createDelegate(this)
			},{
				text: 'Medir área',
				ref: 'measureAreaButton',
				enableToggle: true,
				tooltip: 'Haga clic sobre para marcar los vértices de un polígono.' +
				' Haga doble clic para finalizar el polígono.',
				toggleGroup: toggleGroup,
				handler: function(toggled){
					if (toggled) {
						this.area.activate();
					} else {
						this.area.deactivate();
					}
				}.createDelegate(this)
			},{
				text: 'Agregar al mapa',
				ref: 'addButton',
				handler: function() {
					this.fireEvent('addbuttonclicked',this.tempRecord);
				}.createDelegate(this)
			}]
		}
				
	    });
		
       
	    IGN.measurementsWindow.superclass.initComponent.apply(this, arguments);
		
	    
	}
});