Ext.namespace('IGN.contentPanel');

IGN.contentPanel = Ext.extend(Ext.Window, {
	initComponent: function(){
		this.DataView = new Ext.DataView({
			cls: 'contentPanelDataView',
			tpl:  '<div>'+
				'<tpl for=".">'+
				'<div class="search-item {class} x-unselectable">'+
					'<div class="removeLink"><img src="http://mapa.ign.gob.ar/img/ext/default/s.gif""></div>'+
					'<h3>{title}</h3>'+
					'<span>{servername}</span>'+
				'</div></tpl></div>',
			itemSelector: 'div.search-item',
			plugins      : new net.drasill.plugins.SortableDataView(),
			singleSelect:true
		
		});
		this.DataView.on({
			'click': function(DataView, index, node, e)
			{
				if ( Ext.fly(e.getTarget()).hasClass('removeLink') ) {
					e.stopEvent();
					var record = DataView.getSelectedRecords()[0];
					this.fireEvent('removebuttonclicked', record, e);
					return true;
				} else {
					e.stopEvent();
					var record = DataView.getSelectedRecords()[0];
					this.fireEvent('recordclicked', record , e);
				}
				return true;
			}
		});
		Ext.apply(this, {
			items:this.DataView
		});
		IGN.contentPanel.superclass.initComponent.apply(this, arguments);
	}
});

