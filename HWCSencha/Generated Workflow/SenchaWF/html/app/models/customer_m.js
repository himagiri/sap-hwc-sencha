

app.models.Customer = Ext.regModel("app.models.Customer", {
    idProperty: 'id',
    fields: [
        {name: "id", type: "int"},
        {name: "address", type: "string"},
        {name: "city", type: "string"},
        {name: "company_name", type: "string"},
        {name: "fname", type: "string" },
        {name: "lname", type: "string"},
        {name: "phone", type: "string"},
        {name: "state", type: "string"},
        {name: "zip", type: "string"}
    ],
    proxy: {
        type: "HwcProxy",
		config: {
			mboName: 'Customer'
		},
    }
});

app.stores.customers = new Ext.data.Store({
    model: "app.models.Customer",
    sorters: 'company_name',
    getGroupString : function(record) {
        return record.get('company_name')[0];
    }
});

