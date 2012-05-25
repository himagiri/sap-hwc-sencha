app.views.CustomerDetail = Ext.extend(Ext.Panel, {
    dockedItems: [{
        xtype: 'toolbar',
        title: 'View customer',
        items: [
            {
                text: 'Back',
                ui: 'back',
                listeners: {
                    'tap': function () {
                        Ext.dispatch({
                            controller: app.controllers.customers,
                            action: 'index',
                            animation: {type:'slide', direction:'right'}
                        });
                    }
                }
            },
            {xtype:'spacer'},
            {
                id: 'edit',
                text: 'Edit',
                ui: 'action',
                listeners: {
                    'tap': function () {
                        Ext.dispatch({
                            controller: app.controllers.customers,
                            action: 'edit',
                            id: this.record.getId()
                        });
                    }
                }
            }
        ]
    }],
    styleHtmlContent:true,
    scroll: 'vertical',
    items: [
        {tpl:[
            '<h4>Address</h4>',
            '<div class="field"><span class="label">Street: </span>{address}</div>',
            '<div class="field"><span class="label">City: </span>{city}</div>',
            '<div class="field"><span class="label">State: </span>{state}</div>',
        ]},
        {tpl:[
              '<h4>Contact</h4>',
              '<div class="field"><span class="label">Name: </span>{fname} {lname}</div>',
              '<div class="field"><span class="label">Phone: </span>{phone}</div>',
          ]}
    ],
    updateWithRecord: function(record) {
        Ext.each(this.items.items, function(item) {
            item.update(record.data);
        });
        var toolbar = this.getDockedItems()[0];
        toolbar.setTitle(record.get('company_name') + ' ' + record.get('state'));
        toolbar.getComponent('edit').record = record;
    }
});