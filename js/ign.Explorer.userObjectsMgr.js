Ext.namespace('IGN.Explorer');

IGN.Explorer.userObjectsMgr = Ext.apply(new Ext.util.Observable(), {
    tempFeature:false,
    constructor: function(config)
    {
		IGN.Explorer.contentMgr.on({
			'createpreview': this.createpreview.createDelegate(this),
			'destroypreview': this.destroypreview.createDelegate(this),
			'show': this.show.createDelegate(this),
			'hide': this.hide.createDelegate(this)
	});
		
    },
    createpreview: function(record)
    {
		var app = IGN.Explorer;
		var map = app.UI.mapPanel.map;
		var zoom = 9; //zoom por default
		
		if (! (record instanceof IGN.UserObjectRecord)) {
			return true;
		}
	
		var lonlat = new OpenLayers.LonLat(record.data.lon, record.data.lat);
		map.setCenter(lonlat);
		this.tempFeature = new OpenLayers.Marker(lonlat);
		map.getLayersByName('Marcadores temporales')[0].addMarker(this.tempFeature);				
    },
    destroypreview: function(record)
    {
		var app = IGN.Explorer;
		var map = app.UI.mapPanel.map;
	
		if (this.tempFeature) {
			map.getLayersByName('Marcadores temporales')[0].removeMarker(this.tempFeature);
		}
		this.tempFeature = false;
    },
	show: function(record)
	{
		var app = IGN.Explorer;
		var map = app.UI.mapPanel.map;
		var zoom = 9; //zoom por default
		
		if (! (record instanceof IGN.UserObjectRecord)) {
			return true;
		}

		var lonlat = new OpenLayers.LonLat(record.data.lon, record.data.lat);
		map.setCenter(lonlat);

		var size = new OpenLayers.Size(32,32);
		var url = IGN.Explorer.URL +'/img/marker.png';
		var offset = new OpenLayers.Pixel(-19,-26);
		var icon = new OpenLayers.Icon(url,size,offset);
			/*
			 * para que el ícono tenga el cursor 
			 * de manito
			 */
		icon.imageDiv.style.cursor="pointer";
		
		var marker = new OpenLayers.Marker(lonlat,icon);
		/**
		 * @kludge !!!
		 * no sé por qué falla mágicamente todo
		 * con record.set('marker', marker) y deja de procesarse
		 * todo el código sin ningún error;
		 */
		record.data.marker = marker;
		
		map.getLayersByName('Marcadores permanentes')[0].addMarker(record.get('marker'));
		Ext.fly(icon.imageDiv).frame();

			/*
			 * Registro handler de evento para el clic
			 * sobre el marcador para desplegar información
			 */
		map.events.registerPriority('click', record.get('marker'), function(){});
	},
	hide: function(record)
    {
		var app = IGN.Explorer;
		var map = app.UI.mapPanel.map;
	
		if (! (record instanceof IGN.UserObjectRecord)) {
			return true;
		}
		record = IGN.Explorer.contentMgr.mapContentsStore.getById(record.id);
		map.getLayersByName('Marcadores permanentes')[0].removeMarker(record.get('marker'));
    }
});

IGN.Explorer.userObjectsMgr.constructor();