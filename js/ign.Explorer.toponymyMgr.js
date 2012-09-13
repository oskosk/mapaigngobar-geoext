Ext.namespace('IGN.Explorer');
/**
 * @class IGN.Explorer.toponymyMgr
 */

IGN.Explorer.toponymyMgr = Ext.apply(new Ext.util.Observable(), {
	owner:IGN.Explorer.contentMgr,
    tempMarker:false,
    constructor: function(config)
    {
		IGN.Explorer.contentMgr.on({
			'createpreview': this.createpreview.createDelegate(this),
			'destroypreview': this.destroypreview.createDelegate(this),
			'show': this.show.createDelegate(this),
			'hide': this.hide.createDelegate(this)
		});
		Ext.util.Observable.constructor.call(this, config);
    },
    createpreview: function(record)
	{
		var app = IGN.Explorer;
		
		if (! (record instanceof IGN.searchResultRecord)) {
			return true;
		}
		this.tempMarker = app.UI.createToponymyTempMarker(record);
    },
    destroypreview: function(record)
    {
		var app = IGN.Explorer;
		
		if (this.tempMarker) {
			app.UI.destroyToponymyTempMarker(this.tempMarker);
		}
		this.tempMarker = false;
    },
	show: function(record)
	{
		var app = IGN.Explorer;
		var zoom = 9; //zoom por default
		
		if (! (record instanceof IGN.searchResultRecord)) {
			return true;
		}
		
		/**
		 * @kludge !!!
		 * no sé por qué falla mágicamente todo
		 * con record.set('marker', marker) y deja de procesarse
		 * todo el código sin ningún error;
		 */
		record.data.marker = app.UI.createToponymyMarker(record);
	},
	hide: function(record)
    {
		var app = IGN.Explorer;
		var map = app.UI.mapPanel.map;
	
		if (! (record instanceof IGN.searchResultRecord)) {
			return true;
		}
		record = app.contentMgr.mapContentsStore.getById(record.id);
		app.UI.destroyToponymyMarker(record.get('marker'));
    }
});

IGN.Explorer.toponymyMgr.constructor();
