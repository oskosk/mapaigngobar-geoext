Ext.namespace('IGN.Explorer');

IGN.Explorer.measurementsMgr = Ext.apply(new Ext.util.Observable(), {
	owner:IGN.Explorer.contentMgr,
    tempFeature:false,
    constructor: function(config)
    {
		IGN.Explorer.contentMgr.on({
			'createpreview': this.createpreview.createDelegate(this),
			'destroypreview': this.destroypreview.createDelegate(this),
			'show': this.show.createDelegate(this),
			'hide': this.hide.createDelegate(this)
	});
		//IGN.contentMgr.measurements.superclass.constructor.call(this, config);
    },
    createpreview: function(record, e)
    {
		var app = IGN.Explorer;
		var map = app.UI.mapPanel.map;
		
		if (! (record instanceof IGN.measurementRecord) ) {
			return;
		}
		var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style["default"]);
		
		style.strokeColor ='#15496b';
		style.strokeWidth = 5;
		this.tempFeature = new OpenLayers.Feature.Vector(
			OpenLayers.Geometry.fromWKT(record.get('source').geometry),
			false,
			style
		);
		
		map.getLayersByName('Mediciones')[0].addFeatures([this.tempFeature]);				
    },
    destroypreview: function(record, e)
    {
		var app = IGN.Explorer;
		var map = app.UI.mapPanel.map;
	
		if (! (record instanceof IGN.measurementRecord) ) {
			return;
		}
			if (this.tempFeature) {
			map.getLayersByName('Mediciones')[0].removeFeatures([this.tempFeature]);
		}
		this.tempFeature = false;
    },
	show: function(record)
	{
		var app = IGN.Explorer;
		var map = app.UI.mapPanel.map;
		
		if (! (record instanceof IGN.measurementRecord) ) {
			return;
		}
		
		var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style["default"]);
		style.strokeColor ='#FF0000';
		style.strokeWidth = 5;
		/**
		 * @kludge !!!
		 * no sé por qué falla mágicamente todo
		 * con record.set('feature', new OpenLayers.Feature.Vect...) y deja de procesarse
		 * todo el código sin ningún error;
		 */
		record.data.feature = new OpenLayers.Feature.Vector(
			OpenLayers.Geometry.fromWKT(record.get('source').geometry),
			false,
			style
		);
		
		map.getLayersByName('Mediciones')[0].addFeatures([record.get('feature')]);				

			/*
			 * Registro handler de evento para el clic
			 * sobre el marcador para desplegar información
			 */
		map.events.registerPriority('click', record.marker, function(){});
	},
    hide: function(record, e)
    {
		var app = IGN.Explorer;
		var map = app.UI.mapPanel.map;
	
		if (! (record instanceof IGN.measurementRecord) ) {
			return;
		}
			
		map.getLayersByName('Mediciones')[0].removeFeatures([record.get('feature')]);
		
		this.tempFeature = false;
    }
});

IGN.Explorer.measurementsMgr.constructor();