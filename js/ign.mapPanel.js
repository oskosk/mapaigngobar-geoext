
Ext.namespace('IGN', 'IGN.mapPanel');

IGN.mapPanel = Ext.extend(GeoExt.MapPanel, {
	serverLayers: [],
	serverWMSFeatures: [],
	initComponent: function()
	{
		var map = this.setMap();

		Ext.apply(this, {
			map: map,
			center: IGN.defaultMapCenter,
			layers:IGN.defaultLayers,
			zoom: 0,
			border:true
		});
		this.addEvents(
			/**
			 * @event mapClicked
			 * Generado cuando el usuario clickea el mapa
			 * Acutalmente uso un control WMSGETFeatureInfo
			 * sobre el mapa y este evento se general en el evento
			 * beforegetfeatureinfo del control
			 */
			'mapClicked',
			/**
			 * @event featureInfoReceived
			 * Generado cuando vuelve featureInfo de todos los servidores
			 * al contro WMSGetFeatureInfo del mapa
			 */
			'featureInfoReceived'
		);
		IGN.mapPanel.superclass.initComponent.apply(this, arguments);
	},
	/*
	 * Extiende la instancia OpenLayers.Map con algunas
	 * propiedades y métodos
	 * 
	 */
	setMap: function(options)
	{

		var map = new OpenLayers.Map(IGN.defaultMapOptions);

			/*
			 * Popup para los datos de WMSFeatureInfo
			 */
		map.WMSFeatureInfoPopup = false;
			/*
			 * Escucho eventos de capas para cache
			 * y para la barra de estado que indica las capas que
			 * se están cargando
			 */
		map.events.register('preaddlayer', this, this.addLayerHandler);
		map.events.register('removelayer', this, this.removeLayerHandler);
		
		agregarControles(map);
		return map;

		function agregarControles(map)
		{
			var panel;

			
			map.addControl(new OpenLayers.Control.Scale());
			
			map.ScaleLine = new OpenLayers.Control.ScaleLine();
			map.addControl(map.ScaleLine);
			
			map.PanZoomBar =  new OpenLayers.Control.PanZoomBar( {position:new OpenLayers.Pixel(0,0)} );
			map.addControl(map.PanZoomBar);
			//map.addControl(new OpenLayers.Control.KeyboardDefaults());
			map.addControl(new OpenLayers.Control.MousePosition());
			
			var mouseControl = new OpenLayers.Control.Navigation({
				zoomBoxEnabled:true,
				zoomWheelEnabled:true,
				title:'Mover el mapa y pedir información puntual',
				handleRightClicks:true,
				defaultDblRightClick: function(evt){IGN.mapPanel.map.zoomOut();}
			});
			map.addControl(mouseControl);
			
			map.WMSFeatureInfo = new OpenLayers.Control.WMSGetFeatureInfo(
				{

					title: 'Identify features by clicking',
					queryVisible: true,
					drillDown:true,
					eventListeners: {
						beforegetfeatureinfo: function(event) {
							Ext.getCmp('mapPanel').fireEvent('mapClicked', event);
							
						}.createDelegate(this),
						getfeatureinfo: function(event) {
							Ext.getCmp('mapPanel').fireEvent('featureInfoReceived', event);
						}
					}
				}
			);
			map.WMSFeatureInfo.setMap(map);
			map.WMSFeatureInfo.activate();
			map.addControl(map.WMSFeatureInfo);
		}
	},
	counter:0,
	currentlyLoadingLayers: [],
	onLayerloadstart: function(e) {
		//this.currentlyLoadingLayers.push(e.object);
		//var names = Ext.pluck(this.currentlyLoadingLayers, 'name');
		++this.counter;
		//IGN.Explorer.UI.westPanel.bottomToolbar.showBusy('Cargando capas ' );//+ names.toString() + '...');
	},
	onLayerloadend: function(e) {
		
		//var names = Ext.pluck(this.currentlyLoadingLayers, 'name');
		//Ext.each(this.currentlyLoadingLayers,
		//	function(layer,i) {
		//		console.log(layer);
		//		if (e.object.name==layer.name) {
		//			this.currentlyLoadingLayers.remove(this.currentlyLoadingLayers[i]);
		//		}
		//	}.createDelegate(this)
		//);
		//var names = Ext.pluck(this.currentlyLoadingLayers, 'name');
		//IGN.Explorer.UI.westPanel.bottomToolbar.showBusy('Cargando capas '); //+ names.toString() + '...');
		this.counter--;
		if (this.counter === 0) {
				// IGN.Explorer.UI.westPanel.bottomToolbar.clearStatus();
		}
		
	},
	addLayerHandler: function (e)
	{
		var layer = e.layer;
	    
		if (layer.CLASS_NAME != "OpenLayers.Layer.WMS") {
				return;
		}
		layer.events.register('loadstart', this, this.onLayerloadstart);
		layer.events.register('loadend', this, this.onLayerloadend);
	},

	currentLayerUrl: '',

	removeLayerHandler: function (e)
	{
		var layer = e.layer;

		if (layer.CLASS_NAME != "OpenLayers.Layer.WMS") {
			return;
		}
		//this.onLayerloadend(e);
	}

});
Ext.reg('ign-mappanel', IGN.mapPanel);

