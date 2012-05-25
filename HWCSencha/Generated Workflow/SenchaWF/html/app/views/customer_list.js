app.views.CustomersList = Ext.extend(Ext.Panel, {
    dockedItems: [{
        xtype: 'toolbar',
        title: 'Customers',
        items: [
            {
                id: 'close',
                text: 'Close',
                ui: 'action',
                listeners: {
                    'tap': function () {
                        closeWorkflow();
                    }
                }
            },
            {xtype:'spacer'},
            {
                id: 'add',
                text: 'Add',
                ui: 'action',
                listeners: {
                    'tap': function () {
                        Ext.dispatch({
                            controller: app.controllers.customers,
                            action: 'add',
                        });
                    }
                }
            }
        ]
    }],
    layout: 'fit',
    items: [{
        xtype: 'list',
        store: app.stores.customers,
        itemTpl: '{company_name} {state}',
        grouped: true,
        indexBar: true,
        onItemDisclosure: function (record) {
            Ext.dispatch({
                controller: app.controllers.customers,
                action: 'show',
                id: record.getId()
            });
        }
    }],
    initComponent: function() {
        app.stores.customers.load();
        app.views.CustomersList.superclass.initComponent.apply(this, arguments);
    },
    refreshList: function () {
        var list = this.items.getAt(0).refresh();
    }

});