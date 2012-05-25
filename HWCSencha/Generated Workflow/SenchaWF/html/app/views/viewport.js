app.views.Viewport = Ext.extend(Ext.Panel, {
    fullscreen: true,
    layout: 'card',
    cardSwitchAnimation: 'slide',
    initComponent: function() {
        //put instances of cards into app.views namespace
        Ext.apply(app.views, {
            customersList: new app.views.CustomersList(),
            customerDetail: new app.views.CustomerDetail(),
            customerEdit: new app.views.CustomerEdit()
        });
        //put instances of cards into viewport
        Ext.apply(this, {
            items: [
                app.views.customersList,
                app.views.customerDetail,
                app.views.customerEdit,
            ]
        });
        app.views.Viewport.superclass.initComponent.apply(this, arguments);
    }
});