/**
 * @class IGN.Explorer
 * La aplicación principal del Visualizador
 * @singleton
 * @author OSK
 */
Ext.namespace('IGN', 'IGN.Explorer');
	
	/**
	 * Devuelve la url base del documento
	 * incluyendo protocolo (http://, https://, etc)
	 * hasta el último directorio antes de este documento
	 * ARREGLAR PORQUE lastIndexOf NO FUNCA EN < IE8
	 * @return {String} La dirección de la aplicación incluída
	 * la ruta relativa (directorios)
	 */
IGN.Explorer.getAppLocation = function()
{
	var url = document.location.href;
	var lastSlashIndex = url.lastIndexOf('/');
	if (-1 != lastSlashIndex) {
		url = url.substring(0, lastSlashIndex+1);
	}
	return url;
};

/**
 * El método que se ejecuta inicialmente.
 * Configura lo siguiente:
 * 
 * La dirección de la aplicación
 * 
 * La imagen transparente (s.gif) por default para Ext
 * 
 * * El contentManager
 * 
 * * El viewport
 * 
 * * Las variables locales a este objeto que referencian
 * a los paneles y ventanas. (ej. Explorer.searchPanel).
 * @method
 */
IGN.Explorer.init = function () {
	/*
	 * la URL del sitio
	 */
	this.URL = this.getAppLocation();
	Ext.BLANK_IMAGE_URL = this.URL + 'img/ext/default/s.gif';
	/**
	 * @class IGN.Explorer.contentMgr
	 * @package IGN.Explorer
	 * @extends IGN.contentManager
	 */			
	//this.contentMgr = new IGN.contentMgr({owner:this});			
	/**
	 * @class Explorer.UI
	 * @package Explorer
	 * @extends IGN.UI
	 */
	this.UI = new IGN.UI({'id':'UI'});
	
	Ext.apply(this,{
		//mapPanel: this.UI.mapPanel,
		//statusBar: this.UI.mapPanel.bottomToolbar,
		//toolBar: this.UI.mapPanel.topToolbar,
		//westPanel: this.UI.westPanel,
		//searchPanel: this.UI.searchPanel,
		//legendPanel: this.UI.legendPanel,
		//contentPanel: this.UI.contentPanel,
		//addContentsPanel: this.UI.addContentsPanel,
		//measurementsWindow: this.UI.measurementsWindow
	});
	

	
	/*
	 * En lugar de hacer esto
	 *  this.contentPanel.DataView.bindStore(this.content.mapContentsStore, true);
	 *  Tengo que usar Ext.Apply, porque bindStore obliga a la dataview a hacer un refresh
	 *  que implica renderear la plantilla pero no funciona bien si no hay datos
	 *  en el store creo
	 */
	//Ext.apply(this.contentPanel.DataView,{store:this.content.mapContentsStore});
	this.UI.contentPanel.DataView.bindStore(this.contentMgr.mapContentsStore);
			
	
	this.contentMgr.attachEventHandlers();

	
	Ext.QuickTips.init();
};



