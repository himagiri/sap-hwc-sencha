Ext.regApplication({
    name: 'app',
    launch: function() {
        this.launched = true;
        this.mainLaunch();
    },
    mainLaunch: function() {
        if (!this.launched) {return;}
        this.views.viewport = new this.views.Viewport();
    }
});