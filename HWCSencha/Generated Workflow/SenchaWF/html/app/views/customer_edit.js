app.views.CustomerEdit = Ext.extend(Ext.form.FormPanel, {
	mode: 'edit',
    dockedItems: [{
        xtype: 'toolbar',
        title: 'Edit',
        items: [
            {
                id: 'cancel',
                text: 'Cancel',	
                ui: 'back',
                listeners: {
                    'tap': function () {

                    	if(this.mode === 'add') {
	                        Ext.dispatch({
	                            controller: app.controllers.customers,
	                            action: 'index',
	                            animation: {type:'slide', direction:'right'}
	                        });
                    	} else if(this.mode === 'edit') {
	                        Ext.dispatch({
	                            controller: app.controllers.customers,
	                            action: 'show',
	                            id: this.record.getId(),
	                            animation: {type:'slide', direction:'right'}
	                        });
                    	}
                    }
                }
            },
            {xtype:'spacer'},
            {
                id: 'apply',
                text: 'Apply',
                ui: 'action',
                listeners: {
                    'tap': function () {

                        if(this.mode === 'edit') {
                            this.form.updateRecord(this.record, true);
                            this.record.save();
                        	
	                        Ext.dispatch({
	                            controller: app.controllers.customers,
	                            action: 'show',
	                            id: this.record.getId(),
	                            animation: {type:'slide', direction:'right'}
	                        });
                    	} else if(this.mode === 'add') {
                    			var customer = app.views.customerEdit.getRecord();                    		
                    			app.views.customerEdit.updateRecord(customer);                    		
                       			app.stores.customers.add(customer);
                    		    app.stores.customers.sync();
                    		    app.stores.customers.sort([{ property: 'commpany_name', direction: 'DESC'}]);
                    		    app.views.customersList.refreshList();			
                    			app.views.viewport.setActiveItem(
                    					app.views.customersList, {type:'slide', direction:'right'}
                    			);
                    	}	                    		
                    }
                }
            }
        ]
    },
	{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [
        	{xtype:'spacer'},
            {
                id: 'delete',
                text: 'Delete',
                ui: 'action',
                listeners: {
                    'tap': function () {
	                    Ext.dispatch({
                            controller: app.controllers.customers,
                            action: 'remove',
                            id: this.record.getId()
                        });
                    }
                }
            },
        	{xtype:'spacer'},
 			]
	}],
    submitOnAction: false,
    items: [{
        name : 'company_name',
        label: 'Company',
        xtype: 'textfield'
    }, {
        name : 'state',
        label: 'State',
        xtype: 'textfield'
    }],
    updateWithRecord: function(record, mode) {
        
        this.load(record);
        var toolbar = this.getDockedItems()[0];
        
        toolbar.getComponent('cancel').record = record;
        toolbar.getComponent('apply').record = record;
        toolbar.getComponent('cancel').mode = mode;
        toolbar.getComponent('apply').mode = mode;

        toolbar.getComponent('apply').form = this;

        var bottomtoolbar = this.getDockedItems()[1];
        bottomtoolbar.getComponent('delete').record = record;
		if(mode === 'add')
			bottomtoolbar.hide();
		else 
			bottomtoolbar.show();
	    bottomtoolbar.getComponent('delete').form = this;
    },

    
           
});