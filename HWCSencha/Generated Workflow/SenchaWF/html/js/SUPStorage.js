/*
* Sybase Mobile Workflow version 2.1.3
* 
* SUPStorage.js
* This file will not be regenerated, so it is possible to modify it, but it
* is not recommended.
* 
* Copyright (c) 2011 Sybase Inc. All rights reserved.
*/

/**
* Constructs a new storage area identified by a storage key. This storage
* area persists as long as the current version of a workflow is installed.
* Values given in this object are stored securely. Workflows cannot access
* each other's storage areas.
* 
* @param store The storage key.
*/
function SUPStorage(store) {
    this.bForSharedStorage = false;
    this.store = store ? store : "";
}

/**
* Gets the number of available keys in this object. The keys themselves may be
* retrieved using key().
*/
SUPStorage.prototype.length = function() {
    if (isWindowsMobile() || isIOS()) {
        var xmlHttpReq = getXMLHTTPRequest();
        var strQueryString;
        xmlHttpReq.open("GET", "/sup.amp?querytype=workflowstorage&" + versionURLParam + "&command=length&shared=" + this.bForSharedStorage +
                "&store=" + encodeURIComponent(this.store), false);
        xmlHttpReq.send("");
        return parseInt(xmlHttpReq.responseText);
    }
    else {
        if (this.bForSharedStorage) {
            return _SharedStorage.length(versionURLParam);
        }
        else {
            return _WorkflowStorage.length(this.store);
        }

    }
};

/**
* Returns the key at the supplied index. Keys are guaranteed to remain
* at the same index until a modification is made.
* 
* @param index 0-based index to the key. Must be less than the value retrieved
*     by .length.
* @return The key, or null if the index is invalid.
*/
SUPStorage.prototype.key = function(index) {
    var key;
    if (null == index)
        return null;

    if (isWindowsMobile() || isIOS()) {
        var xmlHttpReq = getXMLHTTPRequest();
        xmlHttpReq.open("GET", "/sup.amp?querytype=workflowstorage&" + versionURLParam + "&command=key&shared=" + this.bForSharedStorage +
                "&store=" + encodeURIComponent(this.store) + "&index=" + encodeURIComponent(index), false);
        xmlHttpReq.send("");
        key = xmlHttpReq.responseText;
        if (key == null || typeof key == 'undefined' || key == "") {
            var xmlHttpReq = getXMLHTTPRequest();
            xmlHttpReq.open("GET", "/sup.amp?querytype=workflowstorage&" + versionURLParam + "&command=indexexist&shared=" + this.bForSharedStorage +
                "&store=" + encodeURIComponent(this.store) + "&index=" + encodeURIComponent(index), false);
            xmlHttpReq.send("");
            var isExist = xmlHttpReq.responseText;

            //WM returns empty string if an item does not exist or if the value is empty string
            //call exist to distinguish this         
            if (isExist == "true")
                key = "";
            else
                key = null;
        }
    }
    else {
        if (this.bForSharedStorage) {
            key = _SharedStorage.key(index, versionURLParam);
        }
        else {
            key = _WorkflowStorage.key(this.store, index);
        }
    }

    if (key == null || typeof key == 'undefined') {
        return null;
    } else {
        return key + "";
    }
};

/**
* Helper method for parameter validation
* 
* @param input: input value .
* @return if input is null, return empty string
*/
function checkNull(input) {
    if (null == input)
        input = "";
    return input;
}

/**
* Retrieves the value associated with a specified key.
* 
* @param key String key corresponding to the requested value.
* @return A String value corresponding to the key, or null if either the key
*     is not known, or if the key exists but its value was set to null. 
*/
SUPStorage.prototype.getItem = function(key) {
    var value;
    key = key ? key : "";

    if (isWindowsMobile() || isIOS()) {
        var xmlHttpReq = getXMLHTTPRequest();
        xmlHttpReq.open("GET", "/sup.amp?querytype=workflowstorage&" + versionURLParam + "&command=getItem&shared=" + this.bForSharedStorage +
                "&store=" + encodeURIComponent(this.store) + "&key=" + encodeURIComponent(key), false);
        xmlHttpReq.send("");
        value = xmlHttpReq.responseText;
        if (value == null || typeof value == 'undefined' || value == "") {
            var xmlHttpReq = getXMLHTTPRequest();
            xmlHttpReq.open("GET", "/sup.amp?querytype=workflowstorage&" + versionURLParam + "&command=exist&shared=" + this.bForSharedStorage +
                "&store=" + encodeURIComponent(this.store) + "&key=" + encodeURIComponent(key), false);
            xmlHttpReq.send("");
            var isExist = xmlHttpReq.responseText;

            //WM returns empty string if an item does not exist or if the value is empty string
            //call exist to distinguish this         
            if (isExist == "true")
                value = "";
            else
                value = null;
        }
    }
    else {
        if (this.bForSharedStorage) {
            value = _SharedStorage.getItem(key, versionURLParam);
        }
        else {
            value = _WorkflowStorage.getItem(this.store, key);
        }
    }

    if (value == null || typeof value == 'undefined') {
        return null;
    } else {
        return value + "";
    }
};

/**
* Sets the value associated with a specified key. This replaces the key's
* previous value, if any.
* 
* @param key String key corresponding to the value.
* @param value String value to store.
*/
SUPStorage.prototype.setItem = function(key, value) {

    key = key ? key : "";
    value = value ? value : "";
    if (isWindowsMobile() || isIOS()) {
        var xmlHttpReq = getXMLHTTPRequest();
        xmlHttpReq.open("POST", "/sup.amp?querytype=workflowstorage&" + versionURLParam, false);
        try {
            xmlHttpReq.send("command=setItem&store=" + encodeURIComponent(this.store) + "&shared=" + this.bForSharedStorage + "&key=" +
   		            encodeURIComponent(key) + "&value=" + encodeURIComponent(value));
        }
        catch (e) {
        }
    }
    else {
        var result;

        if (this.bForSharedStorage) {
            result = _SharedStorage.setItem(key, value, versionURLParam);
        }
        else {
            result = _WorkflowStorage.setItem(this.store, key, value);
        }
        if (result != 0)
            throw new SUPStorageException(result, "SUP storage maximum size reached");
    }
};

/**
* Removes the key and its associated value from this object. If the
* key does not exist, has no effect.
* 
* @param key String key to remove.
*/
SUPStorage.prototype.removeItem = function(key) {

    key = key ? key : "";
    if (isWindowsMobile() || isIOS()) {
        var xmlHttpReq = getXMLHTTPRequest();
        xmlHttpReq.open("GET", "/sup.amp?querytype=workflowstorage&" + versionURLParam + "&command=removeItem&shared=" + this.bForSharedStorage +
                "&store=" + encodeURIComponent(this.store) + "&key=" + encodeURIComponent(key), false);
        xmlHttpReq.send("");
    }
    else {
        if (this.bForSharedStorage) {
            _SharedStorage.removeItem(key, versionURLParam);
        }
        else {
            _WorkflowStorage.removeItem(this.store, key);
        }
    }
};

/**
* Removes all key/value pairs from this object.
*/
SUPStorage.prototype.clear = function() {
    if (isWindowsMobile() || isIOS()) {
        var xmlHttpReq = getXMLHTTPRequest();
        xmlHttpReq.open("GET", "/sup.amp?querytype=workflowstorage&" + versionURLParam + "&command=clear&shared=" + this.bForSharedStorage +
                "&store=" + encodeURIComponent(this.store), false);
        xmlHttpReq.send("");
    }
    else {
        if (this.bForSharedStorage) {
            _SharedStorage.clear(versionURLParam);
        }
        else {
            _WorkflowStorage.clear(this.store);
        }
    }
};

/**
* Exception thrown when Storage space exceeded
*/
function SUPStorageException(code, message) {
    this.code = code;
    this.message = message;
}

SUPStorageException.UNKNOWN_ERROR = 1;
SUPStorageException.MAX_SIZE_REACHED = 2;
SUPStorageException.SHARED_STORAGE_DISABLED = 3;

/*************************************************************************
*  SUP shared storage
**************************************************************************/
/**
* Method to return the shared storage key defined for the workflow by designer
*/
function getSharedStorageKey() {
    return sharedStorageKey;
}

/**
*  Method to indicate whether the shared storage is enabled for the workflow
*/
function isSharedStorageEnabled() {
    if (sharedStorageKey === undefined || sharedStorageKey == "") {
        return false;
    }
    else {
        return true;
    }
}

/**
* Constructs a new SUP shared storage. 
* The shared storage key is defined by workflow designer. The shared storage 
* data are shared by all workflows if those workflows define the same shared 
* storage key. 
* The shared storage data belonging to a particular key will be deleted when 
* the last workflow using this key gets deleted.
*/
function SharedStorage() {

    if ( sharedStorageKey === undefined || sharedStorageKey == "" ) {
        throw new SUPStorageException(SUPStorageException.SHARED_STORAGE_DISABLED, "Shared storage is disabled"); ;
    }
    this.bForSharedStorage = true;
    this.store = "";
}

SharedStorage.prototype = new SUPStorage;
SharedStorage.constructor = SharedStorage;
