Ext.namespace('IGN.featureInfoPanel');

IGN.featureInfoWindow = Ext.extend(GeoExt.Popup, {
	initComponent: function()
	{
		IGN.featureInfoPanel.superclass.initComponent.apply(this, arguments);
	}
});