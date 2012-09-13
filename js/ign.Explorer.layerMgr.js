Ext.namespace('IGN.Explorer');

IGN.Explorer.layerMgr = Ext.apply(new Ext.util.Observable(), {
	owner:IGN.Explorer.contentMgr,
	tempLayer:false,
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
		if (! (record instanceof GeoExt.data.LayerRecord) ) {
			return;
		}
		var app = IGN.Explorer;
		var map = app.UI.mapPanel.map;

		this.tempLayer = record.copy();
		
		this.tempLayer.get("layer").mergeNewParams({
			format: "image/png",
			transparent: true
		});
		if (this.tempLayer.get("layer").CLASS_NAME != "OpenLayers.Layer.WMS") {
				return;
		}
		this.tempLayer.get("layer").events.register('loadstart', this, IGN.Explorer.UI.onLayerloadstart.createDelegate(IGN.Explorer.UI));
		this.tempLayer.get("layer").events.register('loadend', this, IGN.Explorer.UI.onLayerloadend.createDelegate(IGN.Explorer.UI));
		
		this.tempLayer.get("layer").isBaseLayer = false;
		//this.tempLayer.get("layer").singleTile = true;
		this.tempLayer.get("layer").transparent = true;
		app.UI.mapPanel.layers.add(this.tempLayer);
		/*
		map.zoomToExtent(
		   OpenLayers.Bounds.fromArray(this.tempLayer.get("llbbox"))
		);
		*/
    },
    destroypreview: function(record)
    {
		var app = IGN.Explorer;
		var map = app.UI.mapPanel.map;
		
		if (this.tempLayer) {
			app.UI.mapPanel.layers.remove(this.tempLayer);
		}
		this.tempLayer = false;
    },
	show: function(record)
	{
		var app = IGN.Explorer;
		var map = app.UI.mapPanel.map;
		if (! (record instanceof GeoExt.data.LayerRecord) ) {
			return;
		}
		
		app.UI.mapPanel.layers.add(record);
	},
    hide: function(record)
    {
		var app = IGN.Explorer;
		var map = app.UI.mapPanel.map;
		
		if (! (record instanceof GeoExt.data.LayerRecord) ) {
			return;
		}
		record = IGN.Explorer.contentMgr.mapContentsStore.getById(record.id);
		app.UI.mapPanel.layers.remove(record);
    }
});

IGN.Explorer.layerMgr.constructor();