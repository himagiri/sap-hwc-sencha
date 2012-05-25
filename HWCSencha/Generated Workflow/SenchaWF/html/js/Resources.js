/*
 * Sybase Mobile Workflow version 2.1.3
 * 
 * Resources.js
 * This file will be regenerated, so changes made herein will be removed the
 * next time the workflow is regenerated. It is therefore strongly recommended
 * that the user not make changes in this file.
 * 
 * The template used to create this file was compiled on Fri Mar 23 21:29:10 PDT 2012
 *
 * Copyright (c) 2010 Sybase Inc. All rights reserved.
 */
  
function Resources(currentLocaleNameIn) {
	this.currentLocaleName = currentLocaleNameIn;
    
	this.resources = [];
}

Resources.prototype.hasLocale = function(localeName) {
    return this.resources[localeName];
};

Resources.prototype.getStringFromLocale = function(key, localeName) {
	return this.resources[localeName][key];
};
 
Resources.prototype.getString = function(key) {
	return this.getStringFromLocale(key, this.currentLocaleName);
};
