/**
 * @class IGN.searchResultRecord
 * @author osk
 * Tipo de record utilizado para los resultados de b�squeda
 */
IGN.measurementRecord = Ext.data.Record.create([
	/**
	 * El t�tulo a mostrar en el panel de contenido.
	 * Defaults to 'Medici�n'
	 */
	'title',
	/**
	 * El tipo de medici�n 'length' o 'area'
	 */
	'type',
	/**
	 * El evento 'fuente' que gener� la medici�n
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


IGN.UserObjectRecord = Ext.data.Record.create([
	'title',
	'Description',
	'lat',
	'lon',
	/**
	 * El marker que representa al record en el mapa
	 * Seteada por el manager de mediciones (@link IGN.searchResultsManager)
	 */
	{name:'feature',type:'auto'}
]);