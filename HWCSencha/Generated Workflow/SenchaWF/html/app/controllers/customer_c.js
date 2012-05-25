app.controllers.customers = new Ext.Controller({
    index: function(options) {
        app.views.viewport.setActiveItem(
            app.views.customersList, options.animation
        );
    },
    show: function(options) {
        var id = parseInt(options.id),
            customer = app.stores.customers.getById(id);
        if (customer) {
            app.views.customerDetail.updateWithRecord(customer);
            app.views.viewport.setActiveItem(
                app.views.customerDetail, options.animation
            );
        }
    },
    edit: function(options) {
        var id = parseInt(options.id);
         var   customer = app.stores.customers.getById(id);
        if (customer) {
        	old_record = customer.copy();
            app.views.customerEdit.updateWithRecord(customer, 'edit');
            app.views.viewport.setActiveItem(
                app.views.customerEdit, options.animation
            );
        }
    },
    add: function(options) {
    	var customer = Ext.ModelMgr.create({id: Math.round(new Date().getTime() / 1000)}, 'app.models.Customer');
        app.views.customerEdit.updateWithRecord(customer, 'add');
        app.views.viewport.setActiveItem(
                app.views.customerEdit, options.animation
        );
    },
    remove: function(options) {
        var id = parseInt(options.id);

        customer = app.stores.customers.getById(id);
        
        if (customer) {
        	app.stores.customers.remove(customer);
    	    app.stores.customers.sync();
    	    app.views.customersList.refreshList();			
        }
    
	    app.views.viewport.setActiveItem(
	        app.views.customersList, options.animation
	    );

    }
});
