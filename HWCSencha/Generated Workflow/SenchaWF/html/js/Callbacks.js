/*
 * Sybase Mobile Workflow version 2.1.3
 * 
 * Callbacks.js
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 * 
 * Copyright (c) 2011 Sybase Inc. All rights reserved.
 */
 
CallbackSet.setCount = 0;
CallbackSet.callbacks = {};

function CallbackSet() {
	CallbackSet.setCount++;
	this.setId = CallbackSet.setCount;
}

/**
 * Invoked asynchronously to handle callback from container
 * 
 * @param methodName The name of the callback.
 * @param callback The function pointer to the callback
 * @return callbackId that can be used by the container
 */
CallbackSet.prototype.registerCallback = function (methodName, callback) {
	if (!CallbackSet.callbacks[this.setId]) {
		CallbackSet.callbacks[this.setId] = {};
	}

	CallbackSet.callbacks[this.setId][methodName] = callback;
	return this.setId + ':' + methodName;
}

/**
 * Invoked asynchronously to handle callback from container
 * 
 * @param callbackId The id of the callback.  Format is "setid:methodname"
 * @param removeSet True if the callback set should be removed
 * @param args The arguments to be passed to the registered callback
 */
CallbackSet.callbackHandler = function(callbackId, removeSet, args) {
	var c = callbackId.split(':', 2);
	
	if ( c && c.length === 2 ) {
		var callbackSet = CallbackSet.callbacks[c[0]];
		
		if (callbackSet)
		{
			var callback = callbackSet[c[1]];
			
			if (removeSet) {
				delete CallbackSet.callbacks[c[0]]
			}
			
			if (callback) {	
				callback.apply(callback, args);
			}
		}
	}
}
