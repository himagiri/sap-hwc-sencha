Ext.data.ProxyMgr.registerType("HwcProxy",
    Ext.extend(Ext.data.Proxy, {
    	
    	createKey: '{0}_create_{1}_paramKey',
    	readKey: '{0}_{1}_attribKey',
    	updDeleteKey: '{0}_{1}_attribKey',
    	updateDeleteOldValKey: '_old.{0}.{1}',
    	
	    constructor: function(args) {
			var me = this;
	        me.config = args.config;
		},
    	
        create: function(operation, callback, scope) {
        	
        	var thisProxy = this;            
            workflowMessage = new WorkflowMessage("");
            operation.setStarted();	   		
	   		

            var customer = operation.records[operation.records.length-1].data;
            var mvc = getWorkflowMessage().getValues();
			var cmodel = Ext.ModelMgr.getModel(thisProxy.model.modelName);
			customer.id = '' + customer.id;
			
			cmodel.prototype.fields.each(function(item) {
	        	var create_key = thisProxy.createKey.format(thisProxy.config.mboName, item.name);
				var mv = thisProxy.createMessageValue(customer[item.name], create_key, thisProxy.hwcType(item.type.type));
				mvc.add(mv.getKey(), mv);
			});
			
			proxy_createfn(function() { 
                //announce success
                operation.setSuccessful();
                operation.setCompleted();
	            if (typeof callback === 'function') {
	                callback.call(scope || thisProxy, operation);
	            }
			});
			
        },
        read: function(operation, callback, scope) {
        	var thisProxy = this;
            workflowMessage = new WorkflowMessage("");
        	
        	proxy_readfn(
        			function(incomingWorkflowMessage) 
        			{
        				var mvc = getCurrentMessageValueCollection();
        			    var itemList = mvc.getData(thisProxy.config.mboName).getValue();
        				var cmodel = Ext.ModelMgr.getModel(thisProxy.model.modelName);
        			    
				   		operation.setStarted();
			            	
			            var customers = [];
			            for (var i = 0; i < itemList.length; i++) {

			                var currItem = itemList[i];
		    				var values = {};   
			    			cmodel.prototype.fields.each(function(item) {
			    				
			    	        	var rdkey = thisProxy.readKey.format(thisProxy.config.mboName, item.name);
			    				values[item.name] =  currItem.getData(rdkey).getValue();
			    			});

			                var customer = new thisProxy.model(values);
			                customers.push(customer);
			        	}

		   				operation.resultSet = new Ext.data.ResultSet({
		                    records: customers,
		                    total  : itemList.length,
		                    loaded : true
		                });
		                //announce success
		                operation.setSuccessful();
		                operation.setCompleted();
		                //finish with callback
		                if (typeof callback == "function") {
		                    callback.call(scope || thisProxy, operation);
		                }
			        });
				},
        update: function(operation, callback, scope) {
        	
        	var thisProxy = this;            

        	operation.setStarted();
            
        	var len = operation.records.length;
            var customer = operation.records[len-1].data;

            var thisProxy = this;

            workflowMessage = new WorkflowMessage("");
			var mvc = getWorkflowMessage().getValues();
			var cmodel = Ext.ModelMgr.getModel(thisProxy.model.modelName);
			
			cmodel.prototype.fields.each(function(item) {
	        	var newkey = thisProxy.updDeleteKey.format(thisProxy.config.mboName, item.name);
				var mv = thisProxy.createMessageValue(customer[item.name], newkey, thisProxy.hwcType(item.type.type));
				mvc.add(mv.getKey(), mv);
				
	        	
				var oldkey = thisProxy.updateDeleteOldValKey.format(thisProxy.config.mboName, item.name);
	        	var mv2;
	        	

        		mv2 = thisProxy.createMessageValue(old_record.data[item.name], oldkey, thisProxy.hwcType(item.type.type)); 
				mvc.add(mv2.getKey(), mv2);

			});
			
			proxy_updatefn(function() { 
                operation.setSuccessful();
                operation.setCompleted();
	            if (typeof callback === 'function') {
	                callback.call(scope || thisProxy, operation);
	            }	           
			});
            
        },
        destroy: function(operation, callback, scope) {
        	var thisProxy = this;            
        	
        	operation.setStarted();
            
        	var len = operation.records.length;
            var customer = operation.records[len-1].data;

            var thisProxy = this;

            workflowMessage = new WorkflowMessage("");
			var mvc = getWorkflowMessage().getValues();
			var cmodel = Ext.ModelMgr.getModel(thisProxy.model.modelName);
			
			cmodel.prototype.fields.each(function(item) {
	        	var newkey = thisProxy.updDeleteKey.format(thisProxy.config.mboName, item.name);
				var mv = thisProxy.createMessageValue(customer[item.name], newkey, thisProxy.hwcType(item.type.type));
				mvc.add(mv.getKey(), mv);
				var oldkey = thisProxy.updateDeleteOldValKey.format(thisProxy.config.mboName, item.name);
	        	var mv2 = thisProxy.createMessageValue(old_record.data[item.name], oldkey, thisProxy.hwcType(item.type.type)); 
				mvc.add(mv2.getKey(), mv2);
			});
			
			proxy_deletefn(function() { 
                operation.setSuccessful();
                operation.setCompleted();
	            if (typeof callback === 'function') {
	                callback.call(scope || thisProxy, operation);
	            }	           
			});
        },
        // private
        createMessageValue: function(value, key, type) {
            var mv = new MessageValue();
            mv.setValue(value);
            mv.setKey(key);
            mv.setType(type);
            return mv;
        },
        hwcType: function(senchaType) {
        	if(senchaType == 'string')
        		return "TEXT";
        	else if(senchaType == 'int') 
        		return "NUMBER";
        	else if(senchaType == 'date') 
        		return "DATETIME";
        	else if(senchaType == 'booolean') 
        		return "BOOLEAN";
        	else return null;
        }
    })
);

String.prototype.format = function(i, safe, arg) {

	  function format() {
	    var str = this, len = arguments.length+1;

	    // For each {0} {1} {n...} replace with the argument in that position.  If 
	    // the argument is an object or an array it will be stringified to JSON.
	    for (i=0; i < len; arg = arguments[i++]) {
	      safe = typeof arg === 'object' ? JSON.stringify(arg) : arg;
	      str = str.replace(RegExp('\\{'+(i-1)+'\\}', 'g'), safe);
	    }
	    return str;
	  }

	  // Save a reference of what may already exist under the property native.  
	  // Allows for doing something like: if("".format.native) { /* use native */ }
	  format.native = String.prototype.format;

	  // Replace the prototype property
	  return format;

}();
