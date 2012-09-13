<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="es-ES"> 
 
<head profile="http://gmpg.org/xfn/11"> 
<!-- <meta http-equiv="Page-Enter" content="RevealTrans(Transition=12,Duration=0)" /> --> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> 
<link type="text/css" rel="stylesheet" href="/css/build.css" /> 
<title> SIGN</title> 

<style type="text/css">
    #initLoading{
        position:absolute;
        left:45%;
        top:40%;
        padding:2px;
        z-index:20001;
        height:auto;
    }
	#initLoading .initLoading-indicator{
        color:#444;
		text-align:center;
        font:bold 13px tahoma,arial,helvetica;
        padding:10px;
        margin:0;
        height:auto;
    }
</style>

<body>
<div id="initLoading">
	<img src="/img/IGNlogo.png" /><br/>
	<div class="initLoading-indicator">
		<img src="http://wms.ign.gob.ar/img/loading.gif"/><br/>
		Cargando visualizador..
	</div>
</div>


<script src="js/build/visualizador.js"></script> 
<script type="text/javascript"> 

Ext.onReady(IGN.Explorer.init, IGN.Explorer);
Ext.onReady(function() {
    Ext.getBody().show();
    Ext.get('initLoading').remove();
 
});

</script> 
</body> 

</html> 
