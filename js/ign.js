Ext.namespace('IGN');
/**
 * @class IGN
 * El objeto IGN a partir del cual se
 * instancian los componentes del visor.
 * @singleton
 * @extends Ext.Util.Observable
 */
IGN = new Ext.util.Observable();

Ext.apply(IGN, {
	/**
	 * URL base del servidor IGN para las consultas a la
	 * api JSON
	 * @property 
	 * @type String
	 */
	BASEURL: "http://mapa.ign.gob.ar/",
	/**
	 * URL de las capabilities del servidor local. Las capas
	 * de este servidor de muestra por default en el panel de
	 * agregar contenido
	 * ! para cuando el visor vaya incluído en geoserver
	 * @type String
	 */
	defaultCapabilities:'http://mapa.ign.gob.ar/geoserver/ows?service=wms&version=1.1.1&request=GetCapabilities',
	/**
	 * La URL del geoserver del cual se va a sacar la capa base
	 * @type String
	 */
	SERVER: "http://wms.ign.gob.ar/geoserver/wms",
	/**
	 * La URL del cache de tiles
	 * @type String
	 */
	CACHE: "http://wms.ign.gob.ar/geoserver/gwc/service/wms",
	/**
	 * Longitud y latitud que usa el IGN.mapPanel por default
	 * @type OpenLayers.LonLat
	 */
	defaultMapCenter: new OpenLayers.LonLat(-58.67090, -36.71387)
});


Ext.apply(IGN, {
	/**
	 * Capas predeterminadas para el mapa
	 * @property defaultLayers
	 * @type Array/OpenLayers.Layer arr
	 */
	defaultLayers: [
		new OpenLayers.Layer.WMS(
			"Base IGN 250",
			IGN.CACHE,
			{
				layers: [
					'SIGN'
					//'SIGN:Oceano',
					//'SIGN:continente',
					//'SIGN:jad',
					//'SIGN:cun',
					//'SIGN:afl',
					//'SIGN:lim',
					//'SIGN:lag',
					//'SIGN:eji',
					//'SIGN:cam',
					//'SIGN:ffc',
					//'SIGN:cep'
				],
				format: "image/png"
			},{
				isBaseLayer: true,
				displayInLayerSwitcher:true,
				transitionEffect:"resize"
			}
		),
		new OpenLayers.Layer.Vector("Mediciones"),
		new OpenLayers.Layer.Markers( "Marcadores temporales" , {displayInLayerSwitcher:false} ),
		new OpenLayers.Layer.Markers( "Marcadores permanentes" , {displayInLayerSwitcher:false} )
		
	],
	/**
	 * Las opciones predeterminada para la instancia
	 * de OpenLayers.Map del  {@link IGN.mapPanel}
	 * @type Object
	 */
	defaultMapOptions : {
		controls: [],
		restrictedExtent: new OpenLayers.Bounds(-76, /*-58.058*/ -56.70, /*-40.636*/ -52.30, -20.778),
		
		//maxExtent: new OpenLayers.Bounds(-73.567,-55.058,-41.37138021715635,-6.764570325734532),
		//maxExtent: new OpenLayers.Bounds(-80, -90, 180, 90),
		tileSize: new OpenLayers.Size(256,256),
		projection: new OpenLayers.Projection('EPSG:4326'),
		units:"degrees",
		resolutions: [0.06288206988836649, 0.025152827955346596, 0.012576413977673298, 0.0025152827955346596, 0.0012576413977673298, 6.288206988836649E-4, 2.5152827955346593E-4]//, 1.2576413977673296E-4, 6.288206988836648E-5, 2.5152827955346596E-5]
		//scales: [25000000, 10000000, 5000000, 1000000, 500000, 250000, 100000, 50000, 25000, 10000] 
	},	
	/**
	 * Configura valores predeterminados para la API de OpenLayers
	 * como por ejemplo
	 * OpenLayers.ProxyHost = '/proxy.php?url=';
	 * @method
	 */
	setOpenLayersDefaults : function()
	{
		/*
		 * Script de proxy para WFS y demás, pero principalmente
		 * para el GetFeatureInfo a los servidores WMS
		 */
		OpenLayers.ProxyHost = '/proxy.php?url=';

		/*
		 * Resolución de las imágenes
		 */
		OpenLayers.DOTS_PER_INCH = 90.71428571428572; 

		/*
		 * Path absoluto de las imágenes de controles y demás
		 */
		OpenLayers.ImgPath = this.BASEURL + 'js/lib/OpenLayers-2.9/build/img/';
		/*
		 * Lenguaje de los controles default de OpenLayers. Necesita
		 * el js de español...
		 */
		OpenLayers.Lang.setCode('es');
		/*
		 * Marker de OpenLayers por default modificado
		 * para que cargue la imagen necesaria para marcar los
		 * resultados de búsquedas
		 */
		OpenLayers.Marker.defaultIcon = function()
		{
			var url = IGN.Explorer.URL +'/img/markerBW.png';
			var size = new OpenLayers.Size(32,32);
			var calculateOffset = function(size)
			{
				return new OpenLayers.Pixel(-19,-26);
			};
			return new OpenLayers.Icon(url,size,null,calculateOffset);
		};
		
		OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
	},
	/**
	 * Genera un objeto OpenLayer.Layer.WMS
	 * a partir de un objeto JSON devuelto por la API
	 * de consulta de capas
	 * @param {none} q
	 * @param {Object} layer Un record devuelto
	 * por una consulta a la API
	 * @method
	 */
	createOpenLayersLayer: function(q, layer)
	{
		var newLayer;
	
		newLayer = new OpenLayers.Layer.WMS(
			layer.title || layer.name, layer.url, {
				layers: layer.name,
				exceptions: layer.exceptions,
				format: layer.formats[0],
				transparent: ! layer.attributes.opaque,
				version: layer.version
			}
		);
		
		return newLayer;
	}
});

IGN.setOpenLayersDefaults();
