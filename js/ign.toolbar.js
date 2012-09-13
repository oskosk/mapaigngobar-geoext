IGN.toolBar = Ext.extend(Ext.Toolbar, {
	cls:'x-unselectable',
	initComponent: function() {
		Ext.apply(this, {
			items: [{
				scale:'large',
				text:'BUSCAR',
				ref:'buttonSearch'
			},{
				xtype:'tbseparator'
			},{
				text:'CREAR OBJETOS',
				ref:'buttonMapObjects',
				hidden:true
			},{
				text:'MEDIR',
				ref:'buttonMeasurements'
			},{
				xtype:'button',
				ref:'buttonContents',
				text:'CONTENIDO DEL MAPA',
					tooltip: 'Muestra el contenido actualmente desplegado sobre el mapa'
			},{
				xtype:'tbfill'
			},{
				xtype:'button',
				scale:'large',
				text:'?',
				id:'button_ayuda',
				menu: [{
					text: 'Ayuda',
					handler: function() {
						window.open('/doc');
					}
				},{
					text: 'Acerca de...',
					id:'button_acercade'
				}]
			}]
		});
		IGN.toolBar.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('ign-toolbar', IGN.toolBar);
