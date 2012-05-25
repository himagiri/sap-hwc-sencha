/*
 * Sybase Mobile Workflow version 2.1.3
 * 
 * WorkflowMessage.js
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 *
 * The template used to create this file was compiled on Fri Mar 23 21:29:10 PDT 2012
 * 
 * Copyright (c) 2010,2011 Sybase Inc. All rights reserved.
 */
MessageValueType = [];

MessageValueType.FILE = "FILE";
MessageValueType.TEXT = "TEXT";
MessageValueType.NUMBER = "NUMBER";
MessageValueType.DATETIME = "DATETIME";
MessageValueType.BOOLEAN = "BOOLEAN";
MessageValueType.LIST = "LIST";

function MessageValue() { 
    this.key;
    this.value;
    this.modifiedValue = [];
    this.type;
}

MessageValue.prototype.getKey = function() { return this.key; };
MessageValue.prototype.setKey = function(key) { this.key = key; };

MessageValue.prototype.getValue = function() { 
    if (this.modifiedValue != undefined && (this.modifiedValue != "")) {
        return this.getModifiedValue();
    }
    else {
        return this.value; 
    }
};
MessageValue.prototype.setValue = function(value) { this.value = value; };

MessageValue.prototype.getModifiedValue = function() { return this.modifiedValue[this.modifiedValue.length - 1][1]; };
MessageValue.prototype.getScreenKeyModOccurredOn = function() { return this.modifiedValue[this.modifiedValue.length - 1][0]; };
MessageValue.prototype.addModifiedValue = function(modifiedValue, screenKey) { this.modifiedValue.push(new Array(screenKey, modifiedValue)); };
MessageValue.prototype.removeAModifiedValue = function(screenKey) {
    if (this.modifiedValue != undefined && (this.modifiedValue.length > 0)) {
        if (this.getScreenKeyModOccurredOn() === screenKey) {
            this.modifiedValue.pop();
        }
    } 
};
MessageValue.prototype.clearModifiedValues = function() { this.modifiedValue = []; };


MessageValue.prototype.getType = function() { return this.type; };

MessageValue.prototype.setType = function(type) {
	// Validate the given type.
	if (type === MessageValueType.TEXT ||
	    type === MessageValueType.NUMBER ||
	    type === MessageValueType.DATETIME ||
	    type === MessageValueType.BOOLEAN ||
	    type === MessageValueType.LIST ||
	    type === MessageValueType.FILE) {
   			this.type = type; 
 	}
 	else {
 		throw "Invalid MessageValue type: " + type;
 	}
};

function MessageValueCollection() {
    this.key;
    this.state;
    this.parent;
    this.parentValue;
    this.values;
    this.storage = {};
}


MessageValueCollection.prototype.getKey = function() { return this.key; };
MessageValueCollection.prototype.setKey = function(key) { this.key = key; };

// The valid values for the 'state' property are: "add", "delete", "new", "update", ""
MessageValueCollection.prototype.getState = function() { return this.state; };
MessageValueCollection.prototype.setState = function(state) { this.state = state; };

MessageValueCollection.prototype.getParent = function() { return this.parent; };
MessageValueCollection.prototype.setParent = function(parent) { this.parent = parent; };

MessageValueCollection.prototype.getParentValue = function() { return this.parentValue; };
MessageValueCollection.prototype.setParentValue = function(parentValue) { this.parentValue = parentValue; };

MessageValueCollection.prototype.add = function(key, value) { this.storage[key] = value; };
MessageValueCollection.prototype.clear = function() { this.storage = {}; };
MessageValueCollection.prototype.getData = function(key) { return this.storage[key]; };
MessageValueCollection.prototype.remove = function(key) { delete this.storage[key]; };

MessageValueCollection.prototype.getCount = function() {
    var numValues = 0;
    var property;
    for (property in this.storage) {
        if (this.storage.hasOwnProperty(property)) {
            numValues += 1;
        } 
    }
    return numValues;    
};

MessageValueCollection.prototype.getKeys = function() {
    var keysArray = [];
    var property;
    for (property in this.storage) {
        if (this.storage.hasOwnProperty(property)) {
            keysArray[keysArray.length] = property;
        }
    }
    return keysArray;       
};

MessageValueCollection.prototype.getValues = function() {
    var valuesArray = [];
    var property;
    for (property in this.storage) {
        if (this.storage.hasOwnProperty(property)) {
            valuesArray[valuesArray.length] = this.storage[property];
        }
    }
    return valuesArray;
};


function WorkflowMessage(messageAsString) {
    this.header;
    this.requestAction;
    this.values;
    this.workflowScreen;
    this.hasFileMessageValue = false;
    this.isCompact = true;
    this.createFromString(messageAsString);
}

WorkflowMessage.prototype.getHeader = function() { return this.header ? this.header : ""; };
WorkflowMessage.prototype.setHeader = function(header) { this.header = header; };
WorkflowMessage.prototype.getRequestAction = function() { return this.requestAction ? this.requestAction : ""; };
WorkflowMessage.prototype.setRequestAction = function(requestAction) { this.requestAction = requestAction; };
WorkflowMessage.prototype.getValues = function() { return this.values; };
WorkflowMessage.prototype.getWorkflowScreen = function() { return this.workflowScreen ? this.workflowScreen : ""; };
WorkflowMessage.prototype.setWorkflowScreen = function(workflowScreen) { this.workflowScreen = workflowScreen; };
WorkflowMessage.prototype.setHasFileMessageValue = function (hasFileMessageValue) { this.hasFileMessageValue = hasFileMessageValue;};
WorkflowMessage.prototype.getHasFileMessageValue = function() { return this.hasFileMessageValue;};


WorkflowMessage.prototype.createFromString = function(messageAsString) {
    var parser;
    var document;
    if (messageAsString === "")
    {
        messageAsString = (this.isCompact ? "<M></M>" : "<XmlWidgetMessage></XmlWidgetMessage>");
    }
    if (window.DOMParser) {
        parser = new DOMParser();
        if (isBlackBerry()) {
            document = parser.parseFromString(messageAsString, "application/xhtml+xml");
        }
        else {
            document = parser.parseFromString(messageAsString, "text/xml");
        }
    }
    else if (window.ActiveXObject) {
        document = new ActiveXObject("Microsoft.XMLDOM");
        document.async="false";
        document.loadXML(messageAsString);
    }
    else {
        logToWorkflow("Error:  DOM parser not available", "ERROR");
        return;
    }
    var workflowMessage = document.firstChild;
    if (workflowMessage.nodeName === "XmlWidgetMessage"
            || workflowMessage.nodeName === "XmlWorkflowMessage")
    {
        this.isCompact = false;
    }
    else if (workflowMessage.nodeName === "M")
    {
        this.isCompact = true;
    }
    else
    {
        logToWorkflow("Error:  Unrecognizable workflow message", "ERROR");
        return;
    }
    var headers = workflowMessage.getElementsByTagName(this.isCompact ? "H" : "Header");
    var workflowScreens = workflowMessage.getElementsByTagName(this.isCompact ? "S" : "WidgetScreen");
    var requestActions = workflowMessage.getElementsByTagName(this.isCompact ? "A" : "RequestAction");
    var valuess = workflowMessage.getElementsByTagName(this.isCompact ? "VS" : "Values");
    if (headers && headers.length > 0 && headers.item(0).firstChild) {
        var header = headers.item(0);
        this.setHeader(header.firstChild.nodeValue.toString());
    }
    else {
        this.setHeader("");
    }
    
    if (workflowScreens && workflowScreens.length > 0 && workflowScreens.item(0).firstChild) {
        var workflowScreen = workflowScreens.item(0);
        this.setWorkflowScreen(workflowScreen.firstChild.nodeValue.toString());
    }
    else {
        this.setWorkflowScreen("");
    }

    if (requestActions && requestActions.length > 0 && requestActions.item(0).firstChild) {
        var requestAction = requestActions.item(0);
        this.setRequestAction(requestAction.firstChild.nodeValue.toString());
    }
    else {
        this.setRequestAction("");
    }
    
    if (valuess && valuess.length > 0 && valuess.item(0).firstChild) {
        var valuesChild = valuess.item(0);
        this.values = new MessageValueCollection();
        this.parseMessageValueCollection(valuesChild, this.values);
    }
    else {
        this.values = new MessageValueCollection();
    }
};

WorkflowMessage.prototype.parseMessageValueCollection = function(valuesNode, messageValueCollection) {
    var valueIdx;
    var numValues = valuesNode.childNodes.length;
    for (valueIdx = 0; valueIdx < numValues; valueIdx++) {
        var childItem = valuesNode.childNodes.item(valueIdx);
        if ((!this.isCompact && childItem.nodeName === "Value")
         || (this.isCompact && childItem.nodeName === "V")) {
            var value = new MessageValue();
            value.setKey(childItem.getAttribute((this.isCompact ? "k" : "key")).toString());
            if (this.isCompact) {
            	var type = childItem.getAttribute("t").toString();
            	if (type === "T") {
            		value.setType(MessageValueType.TEXT);
            	}
            	else if (type === "N") {
            		value.setType(MessageValueType.NUMBER);
            	}
            	else if (type === "D") {
            		value.setType(MessageValueType.DATETIME);
            	}
            	else if (type === "B") {
            		value.setType(MessageValueType.BOOLEAN);
            	}
            	else if (type === "L") {
            		value.setType(MessageValueType.LIST);
            	}
            	else if (type === "F") {
            		value.setType(MessageValueType.FILE);
            	}
            }
            else {
            	value.setType(childItem.getAttribute("type").toString());
            }
            if (value.getType() === MessageValueType.LIST) {
                var numCollections = childItem.childNodes.length;
                var collections = new Array(numCollections);
                var collIdx;
                for (collIdx = 0; collIdx < numCollections; collIdx++) {
                    var collection = new MessageValueCollection();
                    var grandchildItem = childItem.childNodes.item(collIdx);
                    collection.setKey(grandchildItem.getAttribute((this.isCompact ? "k" : "key")));
                    collection.setState(grandchildItem.getAttribute((this.isCompact ? "s" : "state")));
                    collection.setParent(value.getKey());
                    collection.setParentValue(value);
                    this.parseMessageValueCollection(grandchildItem, collection);
                    collections[collIdx] = collection;
                }
                // value.value = serializeList(collections);
                value.value = collections;
            }
            else {
                var vNode;
                try {
                    var l = childItem.childNodes.length;
                    if (l) {
                        vNode = childItem.childNodes.item(0);
                        value.value = vNode.nodeValue.toString();
                    }
                    else {
                        value.value = "";
                    }
                }
                catch (e) {
                    showAlertDialog('Troubles parsing ' + vNode.nodeValue + " : " + e.message);
                }
            }
            messageValueCollection.add(value.getKey(), value);
        }
        else if ((!this.isCompact && childItem.nodeName === "Values")
              || (this.isCompact && childItem.nodeName === "VS")) {
            var valuesChild = new MessageValueCollection();
            valuesChild.setKey(childItem.getAttribute((this.isCompact ? "k" : "key")));
            valuesChild.setState(childItem.getAttribute((this.isCompact ? "s" : "state")));
            this.parseMessageValueCollection(childItem, valuesChild); 
            messageValueCollection.add(valuesChild.getKey(), valuesChild);
        }
    }    
};

WorkflowMessage.prototype.serializeToString = function() {
    var message = "";
    message += (this.isCompact ? "<M>" : "<XmlWidgetMessage>");
    message += (this.isCompact ? "<H>" : "<Header>") + this.getHeader();
    message += (this.isCompact ? "</H>" : "</Header>");
    message += (this.isCompact ? "<S>" : "<WidgetScreen>") + this.getWorkflowScreen();
    message += (this.isCompact ? "</S>" : "</WidgetScreen>");
    message += (this.isCompact ? "<A>" : "<RequestAction>") + this.getRequestAction();
    message += (this.isCompact ? "</A>" : "</RequestAction>");
    message += (this.isCompact ? "<VS>" : "<Values>") + this.serializeValues(this.getValues(), "");
    message += (this.isCompact ? "</VS></M>" : "</Values></XmlWidgetMessage>");
    return message;
};

WorkflowMessage.prototype.serializeValues = function(values, prefix) {
    var mess = "";
    var idx;
    var count = values.getCount();
    var keys = values.getKeys();
    for (idx = 0; idx < count; idx++) {
        var data = values.getData(keys[idx]);
        if (!isArray(data.getValue())) {
        	var dataType = data.getType();
        	if(data.getType() === MessageValueType.DATETIME && data.getValue().indexOf('T') == -1) {
        		dataType = "TEXT";
        	}
        	mess += (this.isCompact ? '<V k' : '<Value key');
        	mess += '="' + keys[idx] + '" ';
        	mess += (this.isCompact ? 't' : 'type');
        	mess += '="';
        	mess += (this.isCompact ? dataType.substr(0, 1) : dataType);
        	mess += '">' + escapeValue(data.getValue());
        	mess += (this.isCompact ? '</V>' : '</Value>');
        }
        else {
            mess += (this.isCompact ? '<V k' : '<Value key');
            mess += '="' + keys[idx] + '" ';
        	mess += (this.isCompact ? 't="L">' : 'type="LIST">');
            var idx2;
            for (idx2 = 0; idx2 < data.getValue().length; idx2++) {
                mess += (this.isCompact ? '<VS k' : '<Values key');
                mess += '="' + data.getValue()[idx2].getKey() + '" ';
                mess += (this.isCompact ? 's' : 'state');
                mess += '="'+ data.getValue()[idx2].getState() + '">' +  this.serializeValues(data.getValue()[idx2], prefix + "." + data.getKey() + "[" + idx2 + "]");
                mess += (this.isCompact ? '</VS>' : '</Values>');            
            }
        	mess += (this.isCompact ? '</V>' : '</Value>');
        }
    }
    return mess;
};

WorkflowMessage.prototype.updateValues = function(sourceValues, listViewValuesKey) {
	var values = this.values;
	if (listViewValuesKey) {
		var i;
		for (i = 0; i < listViewValuesKey.length; i++) {
			if (listViewValuesKey[i]) {
				values = narrowTo(values, listViewValuesKey[i]);
			}
		}
	}

    var count = sourceValues.getCount();
    var keys = sourceValues.getKeys();
    for (idx = 0; idx < count; idx++) {
        var oldData = values.getData(keys[idx]);
        if (oldData) {
            values.remove(oldData.getKey());
        }
        var newData = sourceValues.getData(keys[idx]);
        values.add(newData.getKey(), newData);
    }
};


function isArray(testObject) {
    return testObject && !(testObject.propertyIsEnumerable('length')) && typeof testObject === 'object' && typeof testObject.length === 'number';
}


function narrowTo(values, prefix) {
    //see if there is a value with a key == to prefix and return it
    var data = values.getData(prefix);
    if (data) {
        return data;
    }
    
    //if not, loop through any lists and recurse.
    var count = values.getCount();
    var keys = values.getKeys();
    var more = [];
    var valueIdx;
    for (valueIdx = 0; valueIdx < count; valueIdx++) {
        data = values.getData(keys[valueIdx]);
        if (isArray(data.value)) { //we have a list
            //does this list have a Values key that matches the prefix?
            var valuesIdx;
            var value;
            for (valuesIdx = 0; valuesIdx < data.value.length; valuesIdx++) { //for each values in a list
                value = data.value[valuesIdx];
                if (value.getKey() == prefix) {
                    return value;
                }
                // more indepth search may need to be done, but first let's finish search on the same level
                if (isArray(value)) {
                    more.push(value);
                }
            }
        }
    }
    var ret;
    var idx;
    for (idx = 0; idx < more.length; idx++) {
        ret = narrowTo(more[idx], prefix);
        if (ret) {
            return ret;
        }
    }
    return ret;
}
