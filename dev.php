<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="es-ES"> 
 
<head profile="http://gmpg.org/xfn/11"> 
<!-- <meta http-equiv="Page-Enter" content="RevealTrans(Transition=12,Duration=0)" /> --> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> 
<link type="text/css" rel="stylesheet" href="js/lib/ext-3.2.1/resources/css/ext-all.css" />
<link type="text/css" rel="stylesheet" href="css/xtheme-access.css" />
<link type="text/css" rel="stylesheet" href="css/styles.css" />
<link type="text/css" rel="stylesheet" href="css/statusbar.css" />
<link type="text/css" rel="stylesheet" href="js/lib/OpenLayers-2.9/build/theme/default/style.css" />
<title> SIGN</title> 

<body>
<div id="initLoading">
	<img src="img/IGNlogo.png" /><br/>
	<div class="initLoading-indicator">
		<img src="http://wms.ign.gob.ar/img/loading.gif"/><br/>
		Cargando visualizador...
	</div>
</div>

<!-- El orden de inclusión es too much importante -->

<!-- Dependencia de GeoExt y todos los objetos de la interfaz -->
<script src="js/lib/ext-3.2.1/ext-base.js"></script> 
<script src="js/lib/ext-3.2.1/ext-all-debug.js"></script> 


<!-- Dependencia de LoadingPanel.js y GeoExt.js-->
<script src="js/lib/OpenLayers-2.9/build/OpenLayers.js"></script> 

<script src="js/lib/GeoExt/GeoExt.js"></script> 
<script src="js/lib/ext-ux/miframe-min.js"></script> 
<script src="js/lib/ext-ux/iframe-proxy.js"></script> 
<script src="js/lib/ext-ux/SearchField.js"></script> 
<script src="js/lib/ext-ux/StatusBar.js"></script>
<script src="js/lib/ext-ux/sortable-dataview.js"></script>

<!-- Dependencia de ign.js y viewport.js -->
<script src="js/getFeatureInfo.js"></script>
<!-- Dependencia de ign.js y viewport.js-->
<script src="js/ign.js"></script>
<script src="js/ign.recordTypes.js"></script>
<script src="js/ign.toolbar.js"></script> 
<script src="js/ign.mapPanel.js"></script> 
<script src="js/ign.measurementsWindow.js"></script> 
<script src="js/ign.searchPanel.js"></script> 
<script src="js/ign.addContentsPanel.js"></script> 
<script src="js/ign.featureInfoWindow.js"></script>
<script src="js/ign.contentPanel.js"></script>
<script src="js/ign.objectsPanel.js"></script>
<script src="js/ign.Explorer.contentMgr.js"></script> 
<script src="js/ign.Explorer.layerMgr.js"></script>
<script src="js/ign.Explorer.toponymyMgr.js"></script>
<script src="js/ign.Explorer.userObjectsMgr.js"></script>
<script src="js/ign.Explorer.measurementsMgr.js"></script>
<script src="js/ign.Explorer.UI.js"></script>
<script src="js/ign.Explorer.js"></script>
<script src="js/ign.Explorer.optionsMgr.js"></script> 

<script type="text/javascript"> 

Ext.onReady(IGN.Explorer.init, IGN.Explorer);
Ext.onReady(function() {
    Ext.getBody().show();
    Ext.get('initLoading').remove();
 
});

</script> 
</body> 

</html> 
