Ext.namespace('IGN.Explorer');
/**
 * @class IGN.contentManager
 * @extends Ext.util.Observable
 * Se encarga de la visualización, la previsualización
 * y gestión de los objetos que pueden ser representados
 * sobre el mapa. <b>Capas</b>, <b>Resultados de búsquedas</b>,
 * <b>Mediciones</b>, y <b>geometrías</b>
 * @author OSK
 */
IGN.Explorer.contentMgr = Ext.apply(new Ext.util.Observable(), {
	/**
	 * Store con los marcadores
	 * @type Ext.data.Store
	 * 
	 */

	mapContentsStore : new Ext.data.Store(),
	toponymySearchStore: new Ext.data.JsonStore({
				url: IGN.BASEURL + 'webservicee/toponyms/search',
				fields: IGN.searchResultRecord,
				root: 'results'
	}),

	layerSearchStore: new Ext.data.JsonStore({
				url: IGN.BASEURL + 'webservicee/layers/search',
				listeners: {
					'exception': function(obj) {
						console.log(arguments);
					}
				},
				fields: GeoExt.data.LayerRecord.create([
					{name: "name", type: "string", mapping:"proposedName"},
					{name: "title", type: "string", mapping:"title"},
					{name: "abstract", type: "string",mapping:"abstract"},
					{name: "queryable", type: "boolean",mapping:"attributes.queryable"},
					{name: "opaque", type: "boolean",mapping:"attributes.opaque"},
					{name: "noSubsets", type: "boolean"},
					{name: "cascaded", type: "int",mapping:"attributes.cascaded"},
					{name: "fixedWidth", type: "int"},
					{name: "fixedHeight", type: "int"},
					{name: "minScale", type: "float"},
					{name: "maxScale", type: "float"},
					{name: "prefix", type: "string"},
					{name: "formats"}, // array
					{name: "styles"}, // array
					{name: "srs",mapping:"SRS"}, // object
					{name: "dimensions"}, // object
					{name: "bbox"}, // object
					//{name: "llbbox",mapping:"LatLonBoundingBox['@attributes']"}, // array
					{name: "attribution"}, // object
					{name: "keywords"}, // array
					{name: "identifiers"}, // object
					{name: "authorityURLs"}, // object
					{name: "metadataURLs"}, // array
					{name: "layer", convert:IGN.createOpenLayersLayer},
					{name: "class"},
					{name: "servername"}
				]),
				root: 'results'
	}),

	/**
	 * @constructor
	 */
	constructor: function(config)
	{
		this.addEvents(
			/**
			 * @event createpreview
			 * Disparado cuando se necesita que los managers
			 * de cada objeto específico mostrable sore el mapa
			 * generen una preview de un objeto
			 * Esto pasa por ejemplo cuando se selecciona un record
			 * en una búsqueda.
			 * <b> Los handlers de los managers de este evento tienen
			 * que filtrar el mensaje por el tipo de Record
			 * e ignorar el evento si no es del tipo que saben manejar</b>
			 * @param {Record} record El record que se desea previsualizar en el mapa
			 * @param {Mixed} event El evento generado por la UI
			 */
		    'createpreview',
			/**
			 * @event destroypreview
			 * Disparado cuando se necesita que los managers
			 * de cada objeto específico mostrable sobre el mapa
			 * destruyan la preview que pueda estar existiendo actualmente
			 * Esto pasa por ejemplo cuando se deselecciona un record y
			 * se selecciona otro o cuando se agrega un objeto definitivamente
			 * al contenido del mapa.
			 * <b> Los handlers de los managers de este evento tienen
			 * que filtrar el mensaje por el tipo de Record
			 * e ignorar el evento si no es del tipo que saben manejar.</b>
			 * @param {Record} record El record cuya previsualización debe destruirse
			 * @param {Mixed} event El evento generado por la UI
			 */
			'destroypreview',
			/**
			 * @event show
			 * Disparado cuando se necesita que los managers
			 * de cada objeto específico mostrable sobre el mapa
			 * generen la visualización correspondiente para un objeto.
			 * <b> Los handlers de los managers de este evento tienen
			 * que filtrar el mensaje por el tipo de Record
			 * e ignorar el evento si no es del tipo que saben manejar.</b>
			 * @param {Record} record. EL record que se debe representar en el mapa
			 * @param {Mixed} event El evento generado por la UI
			 */
			'show',
			'hide',
			'add',
			'remove'
		);
		/*
		 * @type IGN.contentMgr.layers
		 */ 
		//this.layers = new IGN.contentMgr.layers({owner:this});
		/**
		 * @property searchResults
		 * @type IGN.contentMgr.toponymy
		 */
		//this.searchResults = new IGN.contentMgr.toponymy({owner:this});
		/**
		 * @property searchResults
		 * @type IGN.contentMgr.measurementes
		 */
		//this.measurements = new IGN.contentMgr.measurements({owner:this});
		
		//Ext.util.Observable.constructor.call(this, config);
	},
	/**
	 * Se ejecuta como event handler de varios eventos
	 * de la Interfaz al ser seleccionado un objeto
	 * que tenga representación gráfica en el mapa y
	 * pueda ser agregado a los contenidos del mismo.
	 * Dispara los eventos {@link #destroypreview}
	 * y {@link #createpreview} para que los managers de cada tipo
	 * específico de objetos mostrables sobre el mapa realicen
	 * las tareas apropiadas
	 * @param {Mixed} record El record generado por la interfaz
	 * para el objeto seleccionado. Puede ser GeoExt.data.LayerRecord
	 * , un {@link IGN.searchResultRecord} o un {@link IGN.measurementRecord}
	 * @param {Mixed} event El evento generado por acción del usuario.
	 * Puede ser un evento de Extjs o de OpenLayers. 
	 */
	onObjectSelected: function(record, event)
	{
		if (!record) {
			return;
		}
		
		this.fireEvent('destroypreview', record, event);
		this.fireEvent('createpreview', record, event);
	},
	/**
	 * Se ejecuta como event handler de varios eventos
	 * de la Interfaz que tenga representación gráfica en el mapa y
	 * cunando se requiere que este objeto sea agregado a los contenidos
	 * del mapa.
	 * Dispara los eventos {@link #destroypreview}
	 * y {@link #show) para que los managers de cada tipo
	 * específico de objetos mostrables sobre el mapa realicen
	 * las tareas apropiadas
	 * @param {Mixed} record El record generado por la interfaz
	 * para el objeto seleccionado. Puede ser GeoExt.data.LayerRecord
	 * , un {@link IGN.searchResultRecord} o un {@link IGN.measurementRecord}
	 * @param {Mixed} event El evento generado por acción del usuario.
	 * Puede ser un evento de Extjs o de OpenLayers.
	 */
	onAddRequested: function(record, event)
	{
		if (!record) {
			return;
		}

		record = record.copy();
			/* si el record ya fue agregado
			 * al store no lo agrego de nuevo
			 * !!! Ahora chequea por id del record
			 * pero los id del tipo Layer tienen IDs
			 * no únicas para cada refresh del dataview
			 * de capas WMS
			 */
		if (this.mapContentsStore.getById(record.id)) {
			return;
		}
		//IGN.Explorer.UI.showContentPanel();
		this.fireEvent('destroypreview', record, event );
		this.fireEvent('show', record, event);

		this.mapContentsStore.add(record);
		IGN.Explorer.UI.msg('Objeto agregado', 'El objeto se guardó en el mapa');
	},
	/**
	 * Se ejecuta como event handler del evento 'removeSearchResultRequested'
	 * y 'removeFromContents' de la UI.
	 * Dispara los eventos {@link #hide}
	 * y {@link #show) para que los managers de cada tipo
	 * específico de objetos mostrables sobre el mapa realicen
	 * las tareas apropiadas
	 * @param {Mixed} record El record generado por la interfaz
	 * para el objeto seleccionado. Puede ser GeoExt.data.LayerRecord
	 * , un {@link IGN.searchResultRecord} o un {@link IGN.measurementRecord}
	 * @param {Mixed} event El evento generado por acción del usuario.
	 * Puede ser un evento de Extjs o de OpenLayers.
	 */
	onRemoveRequested:function(record, event)
	{
		var app = IGN.Explorer;

		this.fireEvent('hide', record, event);

		if (app.UI.recordStillInSearchResults(record)) {
			app.UI.showSearchResultAsNotAdded(record);
		}
		
		this.removeFromContents(record);
		
	},
	/**
	 * Saca del Store de contenidos del mapa
	 * el record especificado. En realidad, usa
	 * el id del record que se pasa como parámetro
	 * para identificar un record con el mismo id
	 * en el store ya que el usuario puede quitar contenido
	 * tanto dede un resultado de búsqueda como desde el panel
	 * de contenido
	 * @param {Ext.data.Record} record
	 */
	removeFromContents : function(record)
	{
		record = this.mapContentsStore.getById(record.id);
		Ext.fly(IGN.Explorer.UI.contentPanel.DataView.getNode(record)).fadeOut();
		this.mapContentsStore.remove(record);
	},
	/**
	 * Handler del evento 'mapClicked' de la UI
	 */
	onMapClicked: function(event)
	{

	},

	doProductsSearch: function(xy) {
		var lonlat = IGN.Explorer.UI.mapPanel.map.getLonLatFromPixel(new OpenLayers.Pixel(xy.x, xy.y));

		var a= new Ext.Window({
			title:'PRODUCTOS DEL IGN ASOCIADOS A ESTA ZONA',
			cls:'translucent-window',
			modal:true,
			width:600,
			height:400,
			autoScroll:true
		});
		a.show();
		a.load({
			url: IGN.BASEURL + 'geoar/index.php/Catalog/searchByExt',
			params: {
				lat:lonlat.lat,
				lng:lonlat.lon
			},
			text: 'Buscando productos...'
		});
		//IGN.Explorer.UI.updateSearchResults(records);
	},
	doSearch: function(query) {
		IGN.Explorer.UI.searchPanel.DataView.update('Buscando...');
		this.fireEvent('destroypreview');
		IGN.Explorer.UI.clearSearchResults();
				
		this.toponymySearchStore.load({
			params:{'s': query},
			callback: function(records, options, success) {
				IGN.Explorer.UI.updateSearchResults(records);
			}.createDelegate(this),
			scope:this
		});
		this.layerSearchStore.load({
			params:{'q': query},
			callback: function(records, options, success) {
				IGN.Explorer.UI.updateSearchResults(records);
			}.createDelegate(this),
			scope:this
		});

	},
	/**
	 * Declara listeners para los eventos de la UI
	 */
	attachEventHandlers: function()
	{
		this.toponymySearchStore.on( {
			'beforeload': function()	{
				IGN.Explorer.UI.showSearchPanelAsLoading();
			}.createDelegate(this)
		});
		this.layerSearchStore.on( {
			'beforeload': function()	{
				IGN.Explorer.UI.showSearchPanelAsLoading();
			}.createDelegate(this)
		});

		IGN.Explorer.UI.on({
			'searchTriggered': this.doSearch.createDelegate(this)
		});		
		IGN.Explorer.UI.on({
			'searchResultSelected': this.onObjectSelected.createDelegate(this)
		});
		IGN.Explorer.UI.on({
			'addSearchResultRequested': this.onAddRequested.createDelegate(this)
		});
		IGN.Explorer.UI.on({
			'removeSearchResultRequested': this.onRemoveRequested.createDelegate(this)
		});		

		IGN.Explorer.UI.on({
			'removeFromContentsRequested': this.onRemoveRequested.createDelegate(this)
		});
		
		IGN.Explorer.UI.on({
			'lengthMeasurementSelected': this.onObjectSelected.createDelegate(this)
		});
		IGN.Explorer.UI.on({
			'areaMeasurementSelected': this.onObjectSelected.createDelegate(this)
		});
		IGN.Explorer.UI.on({
			'addMeasurementRequested': this.onAddRequested.createDelegate(this)
		});
		IGN.Explorer.UI.on({
			'mapClicked': this.onMapClicked.createDelegate(this)
		});
		IGN.Explorer.UI.on({
			'addPointRequested': this.onAddRequested.createDelegate(this)
		});
		IGN.Explorer.UI.on({
			'productsSearchRequested': this.doProductsSearch.createDelegate(this)
		});
		
	}	
});

IGN.Explorer.contentMgr.constructor();