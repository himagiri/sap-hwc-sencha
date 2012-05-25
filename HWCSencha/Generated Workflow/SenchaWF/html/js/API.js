/*
 * Sybase Mobile Workflow version 2.1.3
 * 
 * API.js
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 *
 * The template used to create this file was compiled on Fri Mar 23 21:29:10 PDT 2012
 * 
 * Copyright (c) 2010,2011 Sybase Inc. All rights reserved.
 */
 
/****************** CONSTANTS ************************/

var NativeErrorCodes = { UNKNOWN_ERROR: 1,                      // Unknown error
                         ATTACHMENT_NOT_DOWNLOADED: 100,        // Attachment has not been downloaded
                         UNKNOWN_MIME_TYPE: 101,                // Unknown MIME type
                         FILENAME_NO_EXTENSION: 102,            // File name without extension
                         REQUIRED_PARAMETER_NOT_AVAILABLE: 103, // Required parameter is not available
                         CERTIFICATE_NOT_SELECTED: 104,         // No certificate is selected by user
                         UNSUPPORTED_ATTACHMENT_TYPE: 105,      // Attachment type is not supported
                         SSOCERT_EXCEPTION: 106,                // SSO Certificate manager exception
                         FAIL_TO_SAVE_CREDENTIAL: 107,          // Fail to save credential
                         FAIL_TO_SAVE_CERTIFICATE: 108,         // Fail to save certificate
                         DEVICE_NOT_CONNECTED: 109,             // Device is not connected
                         RESPONSE_TOO_LARGE: 110,               // Javascript variable will not be able to handle response
                         NAVIGATION_ERROR: 111,                 // Fail to open URL
                         INVALID_COMMON_NAME: 112               // Invalid common name passed while requesting certificate from Afaria
                                                                // Error codes larger than 500 are reserved for server communication errors which may occur as the result of online requests and/or attachment downloads 
                       };
 
/****************** GENERAL UTILITY FUNCTIONS ************************/

/**
 * A utility function for use in generating a GUID
 */
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

/**
 * Generates a GUID
 * @returns The GUID
 */
function guid() {
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

/**
 * Removes spaces from the specified string.
 * @param str The specified string
 * @param leftAndRightOnly When true removes leading and trailing spaces
 * @returns The trimmed string
 */
function trimSpaces(str, leftAndRightOnly) {
    if (leftAndRightOnly) {
        return str.replace(/^\s+|\s+$/g,"");
    }
    return str.replace(/\s+/g, '');
}

/** ******************* WARNING ************************
 * NOTE: There are two implementations of this function. One is in JavaScript here which will be 
 * built to API.js in the workflow, another one is in Java resides in Utilities.java. If this 
 * implementation is changed, keep in mind to make another implementation synchronized.
 */
/**
 * Converts the specified string to one which is a valid JavaScript function name
 * @param str The specified string
 * @returns The converted string
 */
function convertToValidJavaScriptName(str) { 
	var charIdx;
	var original = str;
	var needHashcode = false;
	var newStr = "";
	
	for (charIdx = 0; charIdx < original.length; charIdx++) 
	{
		var c = original.charAt(charIdx);
		if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
		|| (charIdx > 0 && c >= '0' && c <= '9')
		|| (c === '_')
		|| (c === '$')) {
			newStr = newStr + c;
			continue;
		}
	
		newStr = newStr + "_";
		if (original.charCodeAt(charIdx) > 0x100)
			needHashcode = true;
	}
	
	if (needHashcode)
	{
		return newStr + Math.abs(calculate_hash(original));
	}
	else
	{
		return newStr;
	}
}

function calculate_hash(input) {
	var h = 0;
	var len = input.length;
	for (var i = 0; i < len; i++) 
	{
		h = (31 * h + input.charCodeAt(i)) % 0x10000;
	}
	
	return h;
}


/**
 * Replaces all instances in the specified string of the ?&? character with ?&amp;?, of the
 * ?<? character with ?&lt;?, of the ?>? character with ?&gt;?, of the ??? character with
 * ?&quot;? and of the ??? character with ?&apos;?.
 * @param val The specified value
 * @returns The escaped value
 */
function escapeValue(val) {
    try {
        val = val.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
    }
    catch (e) {}
    return val;
}

/**
 * Replaces all instances in the specified string of the ?&amp;? substring with ?&?, of the
 * ?&lt;? substring with ?<?, of the ?&gt;? substring with ?>?, of the ?&quot;? substring with
 * ??? and of the ?&apos;? substring with ???.
 * @param val The specified val
 * @returns The unescaped value
 */
function unescapeValue(val) {
    try {
        val = val.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&apos;/g,'\'').replace(/&quot;/g,'\"');
    }
    catch (e) {}
    return val;
}


/**
 * Returns true iff the workflow application is being run on an iOS (e.g. iPhone, iPad) platform.
 * @returns True iff the workflow application is being run on an iOS (e.g. iPhone, iPad) platform.
 */
function isIOS() {
    if ((navigator.platform.indexOf("i") === 0)) {
        return true;
    }
    return false;
}
 
 /**
 * Returns true iff the workflow application is being run on iOS5
 * @returns True iff the workflow application is being run on iOS5
 */ 
 function isIOS5() {
 	if (isIOS() && navigator.userAgent.match(/OS 5_[0-9_]+ like Mac OS X/i)) 
  		return true;
 	else 
		return false;
}
 
/**
 * Returns true iff the workflow application is being run on an iPad.
 * @returns True iff the workflow application is being run on an iPad.
 */
function isIPad() {
    if (navigator.userAgent.match(/iPad/i) != null) {
        return true;
    }
    return false;
}


/**
 * Returns true iff the workflow application is being run on a BlackBerry platform.
 * @returns True iff the workflow application is being run on a BlackBerry platform.
 */
function isBlackBerry() {
    if (navigator.platform === "BlackBerry") {
        return true;
    }
    return false;
}

/**
 * Returns true iff the workflow application is being run on a BlackBerry 5.0 OS
 * @returns True iff the workflow application is being run on a BlackBerry 5.0 OS
 */
function isBlackBerry5() {
    if (isBlackBerry()) {
        var ua = navigator.userAgent;
        if (ua.indexOf("BlackBerry 9800") >= 0) {
            return false;
        }           
        if (ua.match(/5\.[0-9]\.[0-9]/i) != null) {
            return true;
        }
    }
    return false;
}

function isBlackBerry5WithTouchScreen() {
    if (isBlackBerry()) {
        if (isBlackBerry5()) {
            var ua = navigator.userAgent;
            if (ua.length > 12 && ua.substring(0, 12) === "BlackBerry95") {
                return true;
            }
        }
    }
    return false;
}

function  isBlackBerry6NonTouchScreen() {
    if (isBlackBerry()) {
        var ua = navigator.userAgent;
        if (  ua.indexOf('9780') > 0 ) {
            return true;
        }
    }
    return false;
}

/**
 * Returns true iff the workflow application is being run on a BlackBerry 7.x OS
 * @returns True iff the workflow application is being run on a BlackBerry 7.x OS
 */
function isBlackBerry7() {
	if (isBlackBerry() && navigator.userAgent.match(/Version\/7\.[0-9]\.[0-9]/i) != null)
		return true;
	else
		return false;
}
/**
 * Returns true iff the workflow application is being run on a Windows Mobile platform.
 * @returns True iff the workflow application is being run on a Windows Mobile platform.
 */
function isWindowsMobile() {  
    if (navigator.platform === "WinCE") {
         return true;
     }
     return false;
 }

/**
 * Returns true iff the workflow application is being run on a Windows platform.
 * @returns True iff the workflow application is being run on a Windows platform.
 */
function isWindows() {
    if (navigator.platform === "Win32" || (navigator.platform === "Win64") || (navigator.platform === "MacIntel")) {
         return true;
     }
     return false;
 }
 
/**
 * Returns true iff the workflow application is being run on an Android platform.
 * @returns True iff the workflow application is being run on an Android platform.
 */
function isAndroid() {
     if (navigator.userAgent.indexOf("Android") > -1) {
        return true;
     }
     return false;
}

function isAndroid3() {
     if (isAndroid()&&  (navigator.userAgent.indexOf("3.0") > -1)) {
        return true;
     }
     return false;
}


function isLocaleDatetimeFormat(htmlElement) {
    var isLocalized = false;
    var typeAttrib = getAttribute(htmlElement, "sup_html_type");

    if(typeAttrib === "date" || typeAttrib === "datetime-local" || typeAttrib === "time") {
        var localizedAttrib = getAttribute(htmlElement, "isLocalizedDisplay");
        isLocalized = (isCustomLookAndFeel || isJQueryMobileLookAndFeel) && (localizedAttrib === "true");
    }
    return isLocalized;
}


/**
 * Reliably returns the specified attribute value for the specified HTML element.
 * @param elem The specified HTML element
 * @param attribName The attribute name
 * @returns The specified attribute value for the specified HTML element.
 */
function getAttribute(elem, attribName) {
    if (isWindowsMobile()) {
        try {
            if (attribName === "defaultValue") {
                return elem.defaultValue;    
            } 
            return elem.getAttribute(attribName);
        }
        catch (e) {
            return null;
        }
    }
    if (attribName === "defaultValue") {
        return elem.defaultValue;    
    }
    return elem.getAttribute(attribName);
}

/**
 * Reliably returns the list of elements with the specified tag name, searching only the subtree
 * underneath the specified element.
 * @param el The specified HTML element
 * @param tagName The specified tag name
 * @returns The list of matching elements
 */
function getElementsByTagName(el, tagName) {
    if (isWindowsMobile()) {
        var elsToReturn = [];
        var count = 0;
        var els = document.getElementsByTagName(tagName);
        var i;
        for (i = 0; i < els.length; i++) {
            if (isSomeFormOfParent(el, els[i])) {
                elsToReturn[count] = els[i];
                count++;
            }
        }
        return elsToReturn;
    }
    else {
       return el.getElementsByTagName(tagName);
    }
    return "";
}

/**
 * Determines whether the second specified HTML element is an ancestor of the first specified HTML element
 * @param el The specified HTML element
 * @param elToTest The specified HTML element to test for ancestorship
 * @returns True if it an ancestor 
 */
function isSomeFormOfParent(el, elToTest) {
    var parentNode = elToTest.parentNode;
    while (parentNode !== null) {
        if (parentNode === el) {
            return true;
        }
        parentNode = parentNode.parentNode;
    }
    return false;
}


/**
 * Returns the element in the form with the specified ID.
 * @param formEl The form element
 * @param elemID The specified ID
 * @returns The element
 */
function getFormElementById(formEl, elemId) {
    if (formEl.elements.length > 0) {
        var i;
        for (i = 0; i < formEl.elements.length; i++) {
            if (formEl[i].id) {
                if (formEl[i].id === elemId) {
                    return formEl[i];
                }
            }
        }
    }
    return;
}

/**
 * Reliably returns an XMLHttpRequest object.
 * @returns An XMLHTTPRequest object.
 */
function getXMLHTTPRequest() {
    var xmlHttpReq;
    if (window.XMLHttpRequest) {
        xmlHttpReq = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlHttpReq;
}


/**
 * Returns the specified parameter value from the current URL (window.location.href).
 * @param paramName The specified parameter name
 * @returns The parameter value
 */
function getURLParam(paramName) {
    //URL of the format ?Key=10003&SubKey=2001
    //1st get the section after the ?
    //2nd determine if there are more than one parameter
    //split on & and look for a match

    var urlStr = window.location.href;
    var idxofQ = urlStr.indexOf("?");
    var indxofS, idxofE, idxofA;
    var pName, pValue;
    var paramSection;
    if (idxofQ > 0) { //there is a parameter section
        paramSection = urlStr.substring(idxofQ + 1);
        idxofA = paramSection.indexOf("&");
        if (idxofA > 0) {//there is one or more parameters in the & section
            var paramSectionsAmp = paramSection.substring(idxofA + 1);
            var ampSections = paramSectionsAmp.split("&");
            if (ampSections.length === 1) { 
                idxofE = paramSectionsAmp.indexOf("=");
                pName = paramSectionsAmp.substring(0, idxofE);
                if (pName.toLowerCase() === paramName.toLowerCase()) {
                    pValue = paramSectionsAmp.substring(idxofE + 1);
                    return decodeURIComponent(pValue);
                }
            }
            else {  //multiple parameters in the & section
                for (indxofS in ampSections) {
                    idxofE = ampSections[indxofS].indexOf("=");
                    pName = ampSections[indxofS].substring(0, idxofE);
                    if (pName.toLowerCase() === paramName.toLowerCase()) {
                        pValue = ampSections[indxofS].substring(idxofE + 1);
                        return decodeURIComponent(pValue);
                    }
                }
            }
            //ok did not find paramName in & section look for it at the start
            idxofE = paramSection.indexOf("=");
            pName = paramSection.substring(0, idxofE);
            if (pName.toLowerCase() === paramName.toLowerCase()) {
                pValue = paramSection.substring(idxofE + 1, idxofA);
                return decodeURIComponent(pValue);
            }
        }
        else { //only one param
            idxofE = paramSection.indexOf("=");
            pName = paramSection.substring(0, idxofE);
            if (pName.toLowerCase() === paramName.toLowerCase()) {
                pValue = paramSection.substring(idxofE + 1);
                return decodeURIComponent(pValue);
            }
        }    
    }
    return pValue;    
}

/****************** WORKFLOW UTILITY FUNCTIONS ************************/

/**
 * Returns a string representation of the specified date (currently only in yyyy-mm-dd format).
 * @param aDate The specified date
 * @returns The date as a string
 */
function getISODateString(aDate) {
    return aDate.getFullYear() + "-" + addZero((aDate.getMonth() + Number(1))) + "-" + addZero(aDate.getDate());
}

/**
* Returns a string representation of the specified date with the local date format
*/
function getLocaleDateString(aDate) {
    return getLocalizedDate(aDate);
    //return aDate.toLocaleDateString();
}

/**
 * Returns a string representation of the specified date with the specified precision (currently only in yyyy-mm-ddThh, yyyy-mm-ddThh:mm or yyyy-mm-ddThh:mm:ss format, depending on the precision string (HOURS, MINUTES, SECONDS)).
 * @param aDateTime The specified datetime
 * @param adjustFromUTC true or false depending if the value should be adjusted from UTC.  Optional
 * @param precision The specified precision. Optional.
 * @returns The datetime as a string
 */
function getISODateTimeString(aDateTime, precision) {
    var dateTimeString = aDateTime.getFullYear() + "-" + addZero((aDateTime.getMonth() + Number(1))) + "-" + addZero(aDateTime.getDate());  //TODO consider the locale
    var t = "T";
    if (precision && (precision === "HOURS")) {
        dateTimeString = dateTimeString + t + addZero(aDateTime.getHours());
    }
    else if (precision && (precision === "MINUTES")) {
        dateTimeString = dateTimeString + t + addZero(aDateTime.getHours()) + ":" + addZero(aDateTime.getMinutes());
    }
    else {
        dateTimeString = dateTimeString + t + addZero(aDateTime.getHours()) + ":" + addZero(aDateTime.getMinutes()) + ":" + addZero(aDateTime.getSeconds());
    }
    return dateTimeString;
}

/**
* Returns a string representation of the specified date with the local date time format
*/
function getLocaleDateTimeString(aDateTime) {
    return getLocalizedDateTime(aDateTime);
    //return aDateTime.toLocaleString();
}

function getISOTimeString(aTime, precision) {
    var timeString = "";
    if (precision && (precision === "HOURS")) {
        timeString = addZero(aTime.getHours());
    }
    else if (precision && (precision === "MINUTES")) {
        timeString = addZero(aTime.getHours()) + ":" + addZero(aTime.getMinutes());
    }
    else {
        timeString = addZero(aTime.getHours()) + ":" + addZero(aTime.getMinutes()) + ":" + addZero(aTime.getSeconds());
    }
    return timeString;
}

/**
* Returns a string representation of the specified date with the local time format
*/
function getLocaleTimeString(aTime) {
    return getLocalizedTime(aTime);
    //return aTime.toLocaleTimeString();
}
 

function getTimeStringToDisplayFromStr(aDateTimeStr, precision) {
    var timeString = "";
    var hours = "00";
    var minutes = "00"
    var seconds = "00";
    var idx = aDateTimeStr.indexOf(":");
    if (idx != -1) {
        hours = aDateTimeStr.substring(0, idx);
        minutes = aDateTimeStr.substring(idx + 1, idx + 3);
    }
    else {
        if (aDateTimeStr.length >= 2) {
            hours = aDateTimeStr.substring(0, 2);
        }
    }
    idx = aDateTimeStr.indexOf(":", idx + 1);
    if (idx != -1) {
        seconds = aDateTimeStr.substring(idx + 1, idx + 3);
    }
    if (precision && (precision === "HOURS")) {
        if (isBlackBerry()) {
            timeString = addZero(hours) + ":00" ;
        }
        else {
            timeString = addZero(hours);
        }
    }
    else if (precision && (precision === "MINUTES")) {
        timeString = addZero(hours) + ":" + addZero(minutes);
    }
    else {
        timeString = addZero(hours) + ":" + addZero(minutes) + ":" + addZero(seconds);
    }
    return timeString;
}


/**
 * Returns a Date for the specified string, which must either be a string representation of a
 * date or must be of the form ?today? or ?today+d? or ?today-d?, where d is a number of days.
 * @param toolingStr The date as specified in the designer
 * @returns The date as a string
 */
function getDateFromExpression(toolingStr) {
    var idxOfToday = toolingStr.indexOf("today");
    var minDate = new Date();
    if (idxOfToday === 0) {
        if (toolingStr.length > 5) {
           var offset = toolingStr.substring(5);
           offset = offset.replace("+", "");
           minDate.setDate(minDate.getDate() + Number(offset));
        }
    }
    else {           
        toolingStr = toolingStr.replace(/-/gi, "/");
        minDate.setTime(Date.parse(toolingStr));
    }
    return minDate;
}

/**
 * Returns true iff the specified string is equal, in a case-insensitive way, to ?true?.
 */
function parseBoolean(value) {
    if (value) {
        return trimSpaces(value, true).toLowerCase() === "true";
    }
    else {
        return false;
    }
}

/**
 * Returns a Date that corresponds to the specified string.
 * @param value The specified string
 * @returns The date
 */
function parseDateTime(formEl, value) {
    var valueStr = value;
    if (value.indexOf("today") === 0) {
        valueStr = getDateTimeToday(formEl, value);
    }
    else if (value.indexOf("now") === 0) {
        valueStr = getDateTimeNow(formEl);
    } 
    else if (value.length === 0) {
        valueStr = getDateTimeNow(formEl);
    } 
    valueStr = valueStr.replace(/-/gi, "/");
    var parts = valueStr.split("T");
    if (parts.length > 0) {
        var aDateTime = Date.parse(parts[0]);
        if (parts.length > 1) {
            var timeParts = parts[1].split(":");
            if (timeParts[0]) {  //hours
                aDateTime = aDateTime + (60 * 60 * 1000 * timeParts[0]); 
            }
            if (timeParts[1]) {
                aDateTime = aDateTime + (60 * 1000 * timeParts[1]); 
            }
            if (timeParts[2]) {
                aDateTime = aDateTime + (1000 * timeParts[2]); 
            }
        }
        return aDateTime;
    }
}

function parseTime(value){
    var valueStr = value;
    valueStr = valueStr.replace(/-/gi, "/");
    var timeParts = valueStr.split(":");
    var aDateTime = Date.parse("1971/1/1");
    if (timeParts[0]) {  //hours
        aDateTime = aDateTime + (60 * 60 * 1000 * timeParts[0]); 
    }
    if (timeParts[1]) {
        aDateTime = aDateTime + (60 * 1000 * timeParts[1]); 
    }
    if (timeParts[2]) {
        aDateTime = aDateTime + (1000 * timeParts[2]); 
    }
    return aDateTime;
}


/**
 * Returns the WorkflowMessage type for the given HTML element.
 * @param theTypeAttrib The type of the specified HTML element
 * @returns The WorkflowMessage type
 */
function convertToSUPType(theTypeAttrib) {
    if (theTypeAttrib && (theTypeAttrib === "checkbox")) {
        return "BOOLEAN";
    }
    else if (theTypeAttrib && (theTypeAttrib === "range")) {
        return "NUMBER";
    }
    else if (theTypeAttrib === "date") {
        return "DATETIME";
    }
    else if (theTypeAttrib === "datetime-local") {
        return "DATETIME";
    }
    else if (theTypeAttrib === "time") {
        return "TEXT";
    }
    else {
        return theTypeAttrib.toUpperCase();
    }
}

/**
 * Returns a string representation of the specified HTML element?s value
 * @param htmlElement The specified HTML element
 * @param theTypeAttrib The type of the specified HTML element
 * @returns The value
 */
function getHTMLValue(htmlElement, theTypeAttrib) {
    if (theTypeAttrib && (theTypeAttrib === "checkbox")) {
        return (htmlElement.checked) ? "true" : "false";
    }
	else if (theTypeAttrib && (theTypeAttrib === "date" || theTypeAttrib === "time")) {
		if(isLocaleDatetimeFormat(htmlElement)&& !isIOS5())
			return htmlElement.ISODateTimeValue;
		else
			return htmlElement.value;
	}
    else if (theTypeAttrib && (theTypeAttrib === "datetime-local")) {
        var value;
    	if(isLocaleDatetimeFormat(htmlElement)&& !isIOS5())
    		value = htmlElement.ISODateTimeValue;
    	else
    		value = htmlElement.value;
        if (!value) {
            return "";
        }
        
        var timeFromHTMLElement = parseDateTime(htmlElement, value);
		var vDateTime = new Date(timeFromHTMLElement);
        var utcDateTime = convertLocalTimeToUtc(vDateTime);
		return getISODateTimeString(utcDateTime);
    }
    else {
        return htmlElement.value;
    }
}


/**
 * Sets the value of the specified HTML element from the specified string representation of
 * the value.
 * @param htmlElement The specified HTML element
 * @param theValue The new value
 * @param screenName The screen the HTML element is on
 */
function setHTMLValue(htmlElement, theValue, screenName, adjustForUTC) {
    var controlType = getAttribute(htmlElement, "type");
    if (htmlElement.tagName === "IMG" || controlType ==='IMAGE' ||  controlType === 'image' ) {
        var staticOptionsAttrib = getAttribute(htmlElement, "sup_static_options");
        if (staticOptionsAttrib && (staticOptionsAttrib === "false")) {
            htmlElement.src = "data:image/jpeg;base64," + theValue;
        }else {
        	if ( theValue.length > 32000){
        	   showAlertDialog("Error occurred during setting image src value for the control which id was "+ htmlElement.id + ".  The possible reasons were 1. File name was too long. 2. The value was not the valid image file name. Please check the property of Input Image Source Binding in the workflow designer and re-generated and try again." );
        	}else if (theValue.length > 0 ) {
                   htmlElement.src = theValue.replace(" ", "%20");
                   if ( isBlackBerry5() ) {
                       htmlElement.src = htmlElement.src.replace(/%5C/g, "/"); 
                   }
            }
        	
        }        
        if (hasjQueryMobile) {
            try {
                 if (htmlElement.parentNode.tagName === 'BUTTON') {
            		 $( htmlElement.parentNode).customButton("refresh");
                }else {
                    $(htmlElement).customButton("refresh");
                }
            }
            catch (e) {
            }
        } 
        return;
    }
    if (htmlElement.tagName === "P") {
        htmlElement.innerHTML = theValue;
        return;
    }      
    var oldValue = htmlElement.value;
    var newValue = theValue;
    if (!(theValue === null) && !(theValue === undefined)) {
        var typeAttrib = getAttribute(htmlElement, "sup_html_type");
        var tagName = htmlElement.tagName;        
        if (typeAttrib && (typeAttrib === "date")) {
            var aDate = new Date(parseDateTime(htmlElement, theValue));
            if(isLocaleDatetimeFormat(htmlElement) && !(isIOS5())) {
            	oldValue = htmlElement.ISODateTimeValue;
				htmlElement.ISODateTimeValue = getISODateString(aDate);
				htmlElement.value = getLocaleDateString(aDate);
				newValue = htmlElement.ISODateTimeValue;
            }
            else {
            	oldValue = htmlElement.value;
            	htmlElement.ISODateTimeValue = undefined;
            	htmlElement.value = getISODateString(aDate);
            	newValue = htmlElement.value;
            }
        }
        else if (typeAttrib && (typeAttrib === "datetime-local")) {
          var aDateTime = new Date(parseDateTime(htmlElement, theValue));
        	if (adjustForUTC) {
				aDateTime = convertUtcToLocalTime(aDateTime);
			}
			
			var dateToShow;
        	if(isLocaleDatetimeFormat(htmlElement) && !(isIOS5())) {
        		oldValue = htmlElement.ISODateTimeValue;
				htmlElement.ISODateTimeValue = getISODateTimeString(aDateTime, getAttribute(htmlElement, "sup_precision"));
				dateToShow = getLocaleDateTimeString(aDateTime);
				newValue = htmlElement.ISODateTimeValue;
        	}
        	else {
        		oldValue = htmlElement.value;
            	htmlElement.ISODateTimeValue = undefined;
            	dateToShow = getISODateTimeString(aDateTime, getAttribute(htmlElement, "sup_precision"));
            	if ( isIOS5() ){
                	if ( getAttribute(htmlElement, "sup_precision") === 'HOURS'){
                		dateToShow = dateToShow+ ":00:00";
                	}else if ( getAttribute(htmlElement, "sup_precision")=== 'MINUTES'){
                		dateToShow = dateToShow+ ":00";
                	}
             }
            	newValue = dateToShow;
        	}
 			if (isBlackBerry5()) {
			   setTimeout("delayedSetValue('" + screenName + "', '" + htmlElement.id + "', '" + dateToShow + "')" , 250);
			   //  This is needed to assure value is restored
 			   htmlElement.value = new Date(dateToShow);
			}
			else {
			   htmlElement.value = dateToShow;
			}
        }
		else if (typeAttrib && (typeAttrib === "time")) {
			var dateToShow;
			var timeStr = getTimeStringToDisplayFromStr(theValue, getAttribute(htmlElement, "sup_precision"));
			var aTime = new Date(parseTime(timeStr));
			if(isLocaleDatetimeFormat(htmlElement) && !(isIOS5())) {
				oldValue = htmlElement.ISODateTimeValue;
				htmlElement.ISODateTimeValue = getISOTimeString(aTime, getAttribute(htmlElement, "sup_precision"));
	            dateToShow = getLocaleTimeString(aTime);
	            newValue = htmlElement.ISODateTimeValue;
			}
			else {
				oldValue = htmlElement.value;
            	htmlElement.ISODateTimeValue = undefined;
            	dateToShow = getISOTimeString(aTime, getAttribute(htmlElement, "sup_precision"));
            	if ( isIOS5() ){
                	if ( getAttribute(htmlElement, "sup_precision") === 'HOURS'){
                		dateToShow = dateToShow+ ":00:00";
                	}else if ( getAttribute(htmlElement, "sup_precision")=== 'MINUTES'){
                		dateToShow = dateToShow+ ":00";
                	}
             }
            	newValue = dateToShow;
			}
			if (isBlackBerry5()) {
               setTimeout("delayedSetValue('" + screenName + "', '" + htmlElement.id + "', '" + dateToShow + "')" , 250);
			   //  This is needed to assure value is restored
 			   htmlElement.value = new Date(dateToShow);
			}
           else {
               htmlElement.value = dateToShow;
           }
		}
        else if (typeAttrib && (typeAttrib === "checkbox")) {
            oldValue = htmlElement.checked;
            htmlElement.checked = parseBoolean(theValue);
            newValue = htmlElement.checked;
            if (hasjQueryMobile) {
                try {
                    $(htmlElement).checkboxradio("refresh");
	            }
                catch (e) {
                    setTimeout("delayedCheckboxSetValue('" + screenName + "', '" + htmlElement.id + "', '" + theValue + "')" , 250);  //This is needed if the control has not been initialized yet CR 666503-1
                }
            }            
        }
        else if (tagName && (tagName === "SELECT")) {
            var staticOptionsAttrib = getAttribute(htmlElement, "sup_static_options");
            if (staticOptionsAttrib && (staticOptionsAttrib === "false")) {

                var optionsPropertyName = "_options." + htmlElement.id;
                var optionsProperty = "";

                if (workflowMessage){
                    optionsProperty = narrowTo(getCurrentMessageValueCollection(), optionsPropertyName);
                }

                var optionIdx;
                for (optionIdx = htmlElement.options.length - 1; optionIdx >= 0; optionIdx--) {
                    htmlElement.remove(optionIdx); 
                }
                if (optionsProperty && optionsProperty.value){
                    var optionsArr = optionsProperty.value.indexOf('|')==-1 ? optionsProperty.value.split('_') : optionsProperty.value.split('|');

                    var desiredIndex = -1;

                    // We prefer to set the value to be the one sent from the server (newValue - optional)
                    // Otherwise, the selection will be the one that was chosen previously (oldValue)
                    if (newValue == "" && oldValue != null && oldValue != "") {
                        newValue = oldValue;
                    }
                    var i;
                    for (i = 0; i < optionsArr.length; i++) {
                        var optionStr = optionsArr[i];
                        var idx = optionStr.indexOf('$');
                        var optionElement = document.createElement("OPTION");
                        optionElement.value = optionStr.substr(0, idx);
                        if (optionElement.value == newValue) {
                            desiredIndex = i;
                        }
                        optionElement.text = optionStr.substr(idx+1);
                        if (isWindowsMobile())
                        {
                            htmlElement.options.add(optionElement);
                        }
                        else
                        {
                            htmlElement.add(optionElement,null);
                        }
                    }
                    if (desiredIndex == -1) {
                        var defaultValue = getAttribute(htmlElement, "sup_default_value");
                        if (defaultValue) {
                            setSelectsSelectedIndex(htmlElement, defaultValue);
                        }
                        else if (desiredIndex == -1) {
                            htmlElement.selectedIndex = 0;
                        }
                    }
                    else {
                        htmlElement.selectedIndex = desiredIndex; 
                    }
                }
            }
            else {
                setSelectsSelectedIndex(htmlElement, theValue);
            }
            if (hasjQueryMobile && $(htmlElement) && $(htmlElement).change) {
                try{
                    var  isDynamic = $(htmlElement).attr('sup_static_options') == 'false';
                    $(htmlElement).selectmenu('refresh', isDynamic );
               }catch( e){
            	  // we don't care since in most of the cases, the selectmenu hadn't been built, update only after it has been built.	
            	}
            }
        }
        else if (typeAttrib && (typeAttrib === "htmlview")) {
            if (theValue) {
                htmlElement.innerHTML = theValue;
            }
        }
        else if (typeAttrib && (typeAttrib === "range")) {
            htmlElement.value = theValue;
            if (hasjQueryMobile) {
                try {
                    $(htmlElement).slider("refresh");
	            }
                catch (e) {
                    setTimeout("delayedSliderSetValue('" + screenName + "', '" + htmlElement.id + "', '" + theValue + "')" , 250);  //This is needed if the control has not been initialized yet CR 666503-1
                }
            }
        }
        else {
            if (controlType === "number") {
                if (newValue != "") {
                    var numOfDecimals = getAttribute(htmlElement, "sup_num_of_decimals");
                    if (numOfDecimals === "0") {
                        newValue = Math.round(parseFloat(newValue));
                    }
                    else {
                        var base =  (Math.pow(10, numOfDecimals));
                        newValue = newValue * base;
                        newValue = Math.round(newValue);
                        newValue  = newValue / base;
                    }
                }
            }
            if (isWindowsMobile()) {
                if (tagName.toLowerCase() === "textarea") {
                    newValue = newValue.replace(/\n\r?/g,'\r\n'); 
                }
            }
            htmlElement.value = newValue;
             
            if (htmlElement.type === "button" ) {
                if ( newValue.length == 0 ) {  //use the default vaue if the new value is empty.
	               htmlElement.value = oldValue;
	            }else { //update the value 
	                if ( hasjQueryMobile ) {
	                    try {
	                        $(htmlElement).customButton("refresh");
	                    }
	                    catch (e) {}
	                }else {
                        htmlElement.innerHTML = htmlElement.innerHTML.replace(oldValue,newValue);
                    }
                }
            } 
        }
        fireHTMLValueChanged(htmlElement, oldValue, newValue);
    }
}


/**
 * Resets the value of the specified HTML element
 * @param formEl The specified HTML element
 * @param screenName The screen the HTML element is on
 */
function resetHTMLValue(formEl, screenName) {
    var type = formEl.type;
    var value = '';
    var defaultValue = getAttribute(formEl, "sup_default_value");
            
    if( defaultValue ) {
        value = defaultValue;
    } else {
        if (type === "text" || type === "textarea" || type === "email" || type === "url" || type === "search" || type === "password") {
            value = "";
        } else if (type === "color") {
            value = "0";
        } else if (type === "range" || type === "number") {
            if (formEl.min) {
                value = formEl.min;
            } else {
                value = "0";
            }
        } else if (type === "checkbox" || type === "radio") {
            value = "false";
        } else if (type === "date") {
            var dateNow = new Date();
            value = getISODateString(dateNow);
        } else if (type === "datetime-local") {
            var dateNow = new Date();
            value = getISODateTimeString(dateNow, getAttribute(formEl, "sup_precision"));
        } else if (type === "time") {
            var dateNow = new Date();
            value = getISOTimeString(dateNow, getAttribute(formEl, "sup_precision"));
        } else if (type === "month") {
            value = "01";
        } else if (type === "week") {
            value = "01";
        }
    }
    setHTMLValue(formEl, value, screenName);
}


/****************** WORKFLOW MESSAGE DATA FUNCTIONS ************************/

/**
 * Gets the key of the current (open) screen.
 * @param listKey Stop when you find a child of the LIST MessageValue with the specified key. Optional.
 * @returns The key of the current (open) screen.
 */
function getCurrentMessageValueCollection(listKey) {
    if (!workflowMessage){
        return "";
    }
    var values = workflowMessage.getValues();
    var i;
    var foundParent;
    if (listKey)
    {
        foundParent = values.getData(listKey);
    }
    for (i = 0; i < listViewValuesKey.length; i++) {
        if (listViewValuesKey[i]) {
            var listViewValues = narrowTo(values, listViewValuesKey[i]);
            if (listViewValues) {
                values = listViewValues;
            }
            if (listKey)
            {
                if (foundParent)
                {
                    return values;
                }
                foundParent = values.getData(listKey);
            }
        }
    }
    return values;
}

/**
 * Gets the entire workflow message.
 * @returns The workflow message.
 */
function getWorkflowMessage() {
    return workflowMessage;
}

/**
 * Gets the message value collection to be sent in an online request
 * @param screenKey The screen where the online request is enacted from
 * @param requestAction The action being enacted. This corresponds to the key of the menuitem.
 * @param keys An array of keys to be used to construct the message value collection
 * @param keyTypes An array of types for the keys  
 * @returns The message value collection
 */
function getMessageValueCollectionForOnlineRequest(screenKey, requestAction, keys, keyTypes) {
    var workflowMessageToSend = new WorkflowMessage("");
    var mvc = getCurrentMessageValueCollection();
    workflowMessageToSend.setHeader(workflowMessage.getHeader());
    workflowMessageToSend.getValues().setKey(mvc.getKey());
    workflowMessageToSend.getValues().setState(mvc.getState());
    workflowMessageToSend.setHasFileMessageValue(workflowMessage.getHasFileMessageValue());
    var i;
    var value;
    for (i = 0; i < keys.length; i++) {
        value = mvc.getData(keys[i]);
        if (!value) {
            value = new MessageValue();
            value.setKey(keys[i]);
            value.setType(keyTypes[i]);
            if (keyTypes[i] === MessageValueType.TEXT) {
                value.setValue("");
            } else if (keyTypes[i] === MessageValueType.NUMBER) {
                value.setValue("0");
            } else if (keyTypes[i] === MessageValueType.DATETIME) {
                value.setValue("1970-01-01");
            } else if (keyTypes[i] === MessageValueType.BOOLEAN) {
                value.setValue("false");
            } else if (keyTypes[i] === MessageValueType.LIST) {
                value.setValue([]);
            }
        }
        workflowMessageToSend.getValues().add(keys[i], value);
    }
    var screenIdx;
    for (screenIdx = 0; screenIdx < previousScreenName.length; screenIdx++) {
        updateMessageValueCollectionFromUI(workflowMessageToSend.getValues(), previousScreenName[screenIdx], keys, keyTypes);
    }
    updateMessageValueCollectionFromUI(workflowMessageToSend.getValues(), getCurrentScreen(), keys, keyTypes);
    workflowMessageToSend.setWorkflowScreen(screenKey);
    workflowMessageToSend.setRequestAction(requestAction);
    return workflowMessageToSend;
}


/****************** WORKFLOW UI FUNCTIONS ************************/

/**
 * Gets the key of the current (open) screen.
 * @returns The key of the current (open) screen.
 */
function getCurrentScreen() {
    return curScreenKey;
}

/**
 * Stores the key of the current (open) screen in the state variable.
 * @returns void
 */
function setCurrentScreen( newScreenKey ) {
    curScreenKey = newScreenKey;
}

/**
 * Gets the key of the last open screen, if any, before this screen was opened. 
 * @returns The key of the previous screen.
 */
function getPreviousScreen() {
    if (previousScreenName.length > 0) {
        return previousScreenName[previousScreenName.length - 1];
    } else {
        return null;
    }
}

/**
 * Gets the message value of the current listview if there is one in the current message value collection
 * @returns a MessageValue
 */
function getListviewMessageValue() {
    var mvc = getCurrentMessageValueCollection();
    if (mvc) {
        var p = mvc.getParentValue();
        if (p) {
            if (p.getType() == "LIST") {
                return p;
            }
        }
    }
}

/**
 * Gets the key of the first listview on the specified screen.
 * @param screenName The specified screen 
 * @returns The listview key
 */
function getListViewKey(screenName) {
    var listViewKey;
    var form = document.getElementById(screenName + "Form");
    if (form) {
        var ulElems;
        var ulElem;
        if (!isCustomLookAndFeel && !isJQueryMobileLookAndFeel) {
            ulElems = getElementsByTagName(form, "ul");
            if (ulElems && ulElems.length > 0) {
                ulElem = ulElems[0];
                listViewKey = ulElem.id;
            }        
        } else {
            ulElems = getElementsByTagName(form, "div");
            if (ulElems && ulElems.length > 0) {
                var i;
                for (i = 0; i < ulElems.length; i++) {
                    if (ulElems[i].className === "listview") {
                        ulElem = ulElems[i];
                        break;
                    }
                }
                if (ulElem) {
                    listViewKey = ulElem.id;
                }
            }
        }
    }
    return listViewKey;
}

/**
 * Navigates from the current (open) screen to a new screen with the specified key.
 * @param toScreen The screen to open
 * @param listViewKey The listview row for which the details screen is being opened. Optional. 
 * @param fromActivationOrCredentialFlow
 */
function navigateForward(toScreen, listViewKey, loading, fromActivationOrCredentialFlow) {
    if (logLevel >= 4) { logToWorkflow("entering navigateForward()", "DEBUG", false); }
    if (toScreen === 0) {  //this might happen with a listview without a target page
        if (logLevel >= 4) { logToWorkflow("exiting navigateForward()", "DEBUG", false); }
        return;
    }
    var origScreenKey = curScreenKey;
    if (!customBeforeNavigateForward(origScreenKey, toScreen)) {
        if (logLevel >= 4) { logToWorkflow("exiting navigateForward()", "DEBUG", false); }
        return;
    }
    if (fromActivationOrCredentialFlow) {
        // do not update the MVC
    }
    else {
        updateMessageValueCollectionFromUI(getCurrentMessageValueCollection(), origScreenKey, null, null, true);
    }
    if (curScreenKey !== toScreen) {
        addNativeMenuItemsForScreen(toScreen);
        if (curScreenKey) {
            if (fromActivationOrCredentialFlow) {
                // do not update the screen stack
            }
            else {
                previousScreenName.push(curScreenKey);
                listViewValuesKey.push(listViewKey);
            }
        }
        updateUIFromMessageValueCollection(toScreen, getCurrentMessageValueCollection());
        setScreenTitle(toScreen);
        showScreen(toScreen, curScreenKey, false);
        setCurrentScreen( toScreen );
    }
    if (hasjQueryMobile && loading) {
        jqueryMobileOnPageLoad();
    }    
    customAfterNavigateForward(origScreenKey, toScreen);
    if (logLevel >= 4) { logToWorkflow("exiting navigateForward()", "DEBUG", false); }
}


/**
 * Closes the current screen and returns to the previous screen, if any. If the specified
 * parameter value is false, the values on the open screen will, if they pass validation, be
 * persisted to the workflow message.
 * @param isCancelled True for a Cancel action, false for a Save action.
 * @param needSave True if it should save first (optional, default: True)
 */
function navigateBack(isCancelled, needSave) {
    if (logLevel >= 4) { logToWorkflow("entering navigateBack()", "DEBUG", false); }
    var origScreenKey = curScreenKey;
    if (!customBeforeNavigateBackward(origScreenKey, isCancelled)) {
        if (logLevel >= 4) { logToWorkflow("exiting navigateBack()", "DEBUG", false); }
        return;
    }
    var saveNeeded;
    if (needSave !== undefined) {
        saveNeeded = needSave;
    }
    else {
        saveNeeded = true;
    }
    if (saveNeeded && !isCancelled && !saveScreen(getCurrentMessageValueCollection(), getCurrentScreen())) {
        if (logLevel >= 4) { logToWorkflow("exiting navigateBack()", "DEBUG", false); }
        return;
    }
    if (previousScreenName.length === 0) {
        if (!isCancelled) {
            // Note: Under normal circumstances, this should never happen
        }
        closeWorkflow();
        if (logLevel >= 4) { logToWorkflow("exiting navigateBack()", "DEBUG", false); }
        return;
    }
    if (isCancelled) { //remove any modified values
        removeModifiedMessageValuesBasedOnCurrentScreen(getCurrentMessageValueCollection(), getCurrentScreen());
    }
    {
        // If there is a listview on this screen, remove its contents
        // before closing the screen
        var form = document.getElementById(getCurrentScreen() + "Form");
        var ulElems = getElementsByTagName(form, "ul");
        if (ulElems.length > 0 && ulElems[0].className === "listview") {
            var ulElem = ulElems[0];
            var linesStr = getAttribute(ulElem, "cells");
            if (linesStr) { 
                ulElem.innerHTML = "";
            }
        }
    }
    var toScreen = previousScreenName.pop();
    listViewValuesKey.pop();
    addNativeMenuItemsForScreen(toScreen);
    updateUIFromMessageValueCollection(toScreen, getCurrentMessageValueCollection());
    showScreen(toScreen, curScreenKey, true);
    setCurrentScreen( toScreen );
    setScreenTitle(curScreenKey);    
    window.scrollTo(0,0);
    customAfterNavigateBackward(origScreenKey, isCancelled);
    if (logLevel >= 4) { logToWorkflow("exiting navigateBack()", "DEBUG", false); }
}


/**
 * Updates the values of the controls on the given screen based on the contents of the
 * specified MessageValueCollection. It is expected that the user will rarely, if ever,
 * need to call this function.
 * @param screenKeyName The screen
 * @param values The message value collection
 */
function updateUIFromMessageValueCollection(screenKeyName, values) {
    if (logLevel >= 4) { logToWorkflow("entering updateUIFromMessageValueCollection()", "DEBUG", false); }
    if (UIUpdateHandlers.length > 0) {
        var handled = false;
        var updateHandlerIdx;
        for (updateHandlerIdx = 0; updateHandlerIdx < UIUpdateHandlers.length; updateHandlerIdx++) {
            var handler = UIUpdateHandlers[updateHandlerIdx];
            if (handler.screenName === screenKeyName) {
                handled = !handler.callback(values);
            }
        }
        if (handled) {
            if (logLevel >= 4) { logToWorkflow("exiting updateUIFromMessageValueCollection()", "DEBUG", false); }
            return;
        }
    }
    
    //Only update the currentPage ... keyNames are not unique across a Workflow
    //Update non form elements such as label, img and button 
    var form = document.getElementById(screenKeyName + "Form");
    var imgs = getElementsByTagName(form, "img");
    var imgIdx;
    for (imgIdx = 0; imgIdx < imgs.length; imgIdx++) {
        var valueToSet = values.getData(imgs[imgIdx].id );
        if (valueToSet) {
            setHTMLValue(imgs[imgIdx], valueToSet.getValue(), screenKeyName);
        }
    }
    
    //button tag used in minimum look and feel
    var bts = getElementsByTagName(form, "button");
    var btIdx = 0;
    for (btIdx =0; btIdx < bts.length;btIdx++) {
         //1. update text
    	var textValue = values.getData(bts[ btIdx].getAttribute('id') );
    	if ( textValue ) {
    		 setHTMLValue(bts[btIdx], textValue.getValue(), screenKeyName);
        }
    	//2.find image tag
        var img = getElementsByTagName( bts[btIdx], "img");
       if ( img.length > 0 ) {  
           var valueToSet = values.getData(img[0].getAttribute('id') );
           if (valueToSet) {
        	   setHTMLValue(img[0], valueToSet.getValue(), screenKeyName);
           }
       }
    }
    
    var labels = getElementsByTagName(form, "p");
    var labelIdx;
    for (labelIdx = 0; labelIdx < labels.length; labelIdx++) {
        var valueToSet = values.getData(labels[labelIdx].id );
        if (valueToSet) {
            setHTMLValue(labels[labelIdx], valueToSet.getValue(), screenKeyName);
        }
    }
    var links = getElementsByTagName(form, "a");
    var linkIdx;
    for (linkIdx = 0; linkIdx < links.length; linkIdx++) {
        var valueToSet = values.getData(links[linkIdx].id );
        if (valueToSet) {
            var prefix = getAttribute(links[linkIdx], "sup_link_prefix");
            var suffix = getAttribute(links[linkIdx], "sup_link_suffix");
            if (prefix || suffix) {
                if (isWindowsMobile()) {
                    if (prefix === "tel:" || (prefix === "mailto:")) {
                        links[linkIdx].href = "javascript:showUrlInBrowser('" + prefix + valueToSet.getValue() + suffix + "')";
                    }
                    else {
                        links[linkIdx].href = prefix + valueToSet.getValue() + suffix;
                    }
                }
                else {
                    links[linkIdx].href = prefix + valueToSet.getValue() + suffix;
                }
                links[linkIdx].innerHTML = valueToSet.getValue();
            }
        }
    }
    
    var elemId;
    var numFormElements = form.elements.length;
    if (form) {
	    if (numFormElements > 0) {
	        var i;
	        for (i = 0; i < numFormElements; i++) {
	            var formEl = form.elements[i];
	            if (disableControls) {
	                formEl.disabled = true;
	            }
	            elemId = formEl.id;
	            if (elemId) {
	                var valueToSet = values.getData(elemId);
	                var found = false;
	                if (valueToSet) {
	                    setHTMLValue(formEl, valueToSet.getValue(), screenKeyName, true);
	                    found = true;
	                }
	                else {
	                    if (supUserName) { //check if this is a user name credential
	                        var credStr = getAttribute(formEl, "credential");
	                        if (credStr) { // we are dealing with a username or password credential
	                            if (credStr === "username") {
	                                setHTMLValue(formEl, supUserName);
	                                found = true;
	                            }
	                        }
	                    }
	                }
	                if (!found && values.getParent()) {
	                    resetHTMLValue(formEl, screenKeyName);
	                }
	            }//if a form element has an id
	        } //for an element in a form
	    }
        var ulElems = getElementsByTagName(form, "ul");
        if (ulElems.length > 0 && ulElems[0].className === "listview") {
            var ulElem = ulElems[0];
            elemId = ulElem.id;
            var linesStr = getAttribute(ulElem, "cells");
            var wrapData = getAttribute(ulElem, "wrap_data");
            wrapData = wrapData != null && wrapData === "true"; 
            var tblHTML = "<table class=\"listview\">";
            if (linesStr) { // we are dealing with a listview
                //need to first remove the old listview
                ulElem.innerHTML = "";
                var lineVars = linesStr.split("&?");
                var targetPage = lineVars[0];
                var altRowColor = lineVars[1];
                if ((altRowColor !== "null") && (altRowColor.length > 0)) {
                    if (document.styleSheets) {
                        var styleSheet = document.styleSheets[0];
                        if (styleSheet.addRule) {
                            var newRule = styleSheet.addRule("table.listview tr.evenrow", "background: " + altRowColor, 0);
                        }
                    }
                }                
                var onEmptyList = decodeURIComponent(lineVars[2]);
                var showHeader = lineVars[3];
                var data = values.getData(elemId);
                var hasAtLeastOneLine = false;
                if (showHeader === "true") {
                    tblHTML = tblHTML + addListViewHeader(linesStr);
                }
                if (data) {
                    tblHTML = tblHTML + "<tbody>";
                    var numValues = data.value.length;
                    var valuesIdx;
                    for (valuesIdx = 0; valuesIdx < numValues; valuesIdx++) { //for each values in a list
                        var listValues = data.value[valuesIdx];
                        if (listValues.getState() === "delete") {
                            continue;
                        }
                        var listValuesCount = listValues.getCount();
                        var listValueKeys = listValues.getKeys();
                        var headers = "";
                        if (lineVars.length === 5) {
                            var lines = lineVars[4].split("&;");
                            var numLines = lines.length;
                            var linesTxt = new Array(numLines);
                            var linesIdx;
                            for (linesIdx = 0; linesIdx < numLines; linesIdx++) {
                                var line = [];
                                var lineDetails = lines[linesIdx];
                                var fields = lineDetails.split("&,");
                                var numFields = fields.length;
                                var fieldIdx;
                                for (fieldIdx = 0; fieldIdx < numFields; fieldIdx = fieldIdx + 7) {
                                    var field = {};
                                    var fieldKey = fields[fieldIdx];
                                    var mv = listValues.getData(fieldKey);
                                    if (mv) {
                                    	var dataValue = mv.getValue();
                                    	if( wrapData ) {
				                    		// User has HTML tags that they want treated as text
				                    		// in the list, not markup.  Replace all &, <, and >
				                    		// and wrap in PRE and CODE tags.
                                    		dataValue = dataValue.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                                    		dataValue = "<PRE><CODE>" + dataValue + "</CODE></PRE>";
                                    	}
                                        field ={
                                            value: dataValue,
                                            width:  fields[fieldIdx + 1],
                                            font: fields[fieldIdx + 3],
                                            dataType: fields[fieldIdx + 4],
                                            imageHeight:fields[fieldIdx + 5],
                                            isStaticImage:fields[fieldIdx + 6]
                                        };
                                    } else {
                                        var empty = "&#60;Empty&#62;";
                                        field = { 
                                            value: empty,
                                            width:  '100',
                                            font: 'normal',
                                            dataType: '',
                                            imageHeight:'',
                                            isStaticImage:''
                                        };
                                    }
                                    line.push( field );                                 
                                }
                                linesTxt[linesIdx] = line;
                            }
                            var onClick = (targetPage) ? ("navigateForward('" + targetPage + "','" + listValues.getKey() + "');")
                                                     : null;    
                            tblHTML = tblHTML + addListViewItem(linesTxt, onClick, altRowColor, valuesIdx % 2 === 1, valuesIdx === 0);
                            hasAtLeastOneLine = true;
                         }
                    } // end each values in a list
                    tblHTML = tblHTML + "</tbody>";
                }
                else {
                    data = new MessageValue();
                    data.setKey(elemId);
                    data.setType("LIST");
                    data.setValue([]);
                    values.add(elemId, data);
                }
                if (!hasAtLeastOneLine && onEmptyList) {
                    var field = { 
                        value: onEmptyList,
                        width:  '100',
                        font: 'normal',
                        dataType: ''
                    };
                    var line = [];
                    line[0] = field;
                    var linesTxt = [];
                    linesTxt[0] = line;
                    tblHTML = tblHTML + addListViewItem(linesTxt, null, altRowColor, true, true);
                }
                tblHTML = tblHTML + "</tbody></table>";
                ulElem.innerHTML = tblHTML;
            }  //end listview
        }  //end if we have an unordered list
        var divElems = getElementsByTagName(form, "div");
        var divElemIdx;
        var divElem;
        var typeAttrib;
        for (divElemIdx = 0; divElemIdx < divElems.length; divElemIdx++) {
            divElem = divElems[divElemIdx];
            elemId = divElem.id;
            typeAttrib = getAttribute(divElem, "sup_html_type");
            if (elemId && typeAttrib && typeAttrib === "htmlview") {
                //we have an htmlview
                var valueToSet = values.getData(elemId);
                if (valueToSet) {
                    setHTMLValue(divElem, valueToSet.getValue(), screenKeyName);
                }
            }
        }
    }
    if(typeof(customAfterUpdateUI)==='function') {
        customAfterUpdateUI(screenKeyName);
    }
    if (logLevel >= 4) { logToWorkflow("exiting updateUIFromMessageValueCollection()", "DEBUG", false); }
}


/**
 * Updates the contents of the specified MessageValueCollection based on the values of the
 * controls on the given screen. It is expected that under most circumstances the user will
 * call saveScreen instead of this function.
 * @param values The message value collection
 * @param screenName The screen
 * @param keys An array of keys which is a list of the only keys to be updated. Optional.
 * @param keyTypes An array of types for the list of keys, if supplied. Optional.
 * @param updateModifiedValue If true, update the modified value and not the actual message value.  Used when navigating forward as opposed to performing a save. Optional.
 */
function updateMessageValueCollectionFromUI(values, screenName, keys, keyTypes, updateModifiedValue) {
    if (logLevel >= 4) { logToWorkflow("entering updateMessageValueCollectionFromUI()", "DEBUG", false); }
    if (screenName === "") return;
    var formElArray = document.forms[screenName+"Form"].elements;
    var i;
    for (i = 0; i < formElArray.length; i++) {
        var credStr = getAttribute(formElArray[i], "credential");
        if (credStr && credStr === "password" || formElArray[i].tagName === "BUTTON" || getAttribute(formElArray[i], "type") === 'button' )  {
            continue;
        }
        var typeAttrib = getAttribute(formElArray[i], "sup_html_type");
        var readonly = getAttribute(formElArray[i], "readonly");
        var nodeName = formElArray[i].nodeName;
        if (formElArray[i].id && ((typeAttrib === "text") || (typeAttrib === "number") || (typeAttrib === "date") || (typeAttrib === "datetime-local") || (typeAttrib === "time") || (typeAttrib === "checkbox") || (typeAttrib === "range"))) {
            var data = values.getData(formElArray[i].id);
            if (!data) {
                data = new MessageValue();
                data.setKey(formElArray[i].id);
                data.setType(convertToSUPType(typeAttrib));
            }
            var formElData = getHTMLValue(formElArray[i], typeAttrib);
            if (updateModifiedValue) {
                data.addModifiedValue(formElData, screenName);
            }
            else {
                data.setValue(formElData, typeAttrib);
                data.clearModifiedValues();
            }
            var okToAdd = false;
            if (keys) {
                var keyIdx = 0;
                for (keyIdx = 0; keyIdx < keys.length; keyIdx++) {
                    if (keys[keyIdx] === data.getKey()) {
                        okToAdd = true;
                        break;
                    }
                } 
            }
            else {
                okToAdd = true;
            }
            if (okToAdd) {
                values.add(data.getKey(), data);
            }
        }
        else {
            if (formElArray[i].id) {
                var ignored = getAttribute(formElArray[i], 'ignored');
                if ( ignored === 'true') {
                    return;
                }
                
                logToWorkflow("Error:  ignoring " + formElArray[i].id + ":" + formElArray[i].value, "ERROR", true);
            }
        }
    }
    if (logLevel >= 4) { logToWorkflow("exiting updateMessageValueCollectionFromUI()", "DEBUG", false); }
}


/**
 * Removes the modified contents of the specified MessageValueCollection.  Called when a screen is cancelled.
 * @param values The message value collection
 * @param screenName The screen
 */
function removeModifiedMessageValuesBasedOnCurrentScreen(values, screenName) {
    if (logLevel >= 4) { logToWorkflow("entering removeModifiedMessageValuesBasedOnCurrentScreen()", "DEBUG", false); }
    if (!values || screenName === "") return;
    var formElArray = document.forms[screenName+"Form"].elements;
    var i;
    for (i = 0; i < formElArray.length; i++) {
        var credStr = getAttribute(formElArray[i], "credential");
        if (credStr && credStr === "password") {
            continue;
        }
        var typeAttrib = getAttribute(formElArray[i], "sup_html_type");
        var nodeName = formElArray[i].nodeName;
        if (formElArray[i].id && ((typeAttrib === "text") || (typeAttrib === "number") || (typeAttrib === "date") || (typeAttrib === "datetime-local") || (typeAttrib === "time") || (typeAttrib === "checkbox") || (typeAttrib === "range"))) {
            var data = values.getData(formElArray[i].id);
            if (data) {
                data.removeAModifiedValue(screenName);
            }
            resetHTMLValue(formElArray[i], screenName);
        }
    }
    if (logLevel >= 4) { logToWorkflow("exiting updateMessageValueCollectionFromUI()", "DEBUG", false); }
}

/**
 * Saves the contents of the specified screen to the specified MessageValueCollection.
 * Differs from updateMessageValueCollectionFromUI in that:
 *     - it will, if directed, first perform validation on the screen
 *     - it supports customization
 *     - it is capable of handling the credential request screen
 * @param currMVC The current message value collection
 * @param currScreen The current screen
 * @param needValidation False if validation should not be done before saving, true (or unspecified) if validation should be done before saving. Optional.
 * @returns True if saving (and validation, if requested) was successful, false otherwise.
 */
function saveScreen(currMVC, currScreen, needValidation) {
    if (logLevel >= 4) { logToWorkflow("entering saveScreen()", "DEBUG", false); }
    var validationNeeded;
    if (needValidation !== undefined) {
        validationNeeded = needValidation;
    }
    else {
        validationNeeded = true;
    }
    if (!document.forms[currScreen+"Form"]) {
        if (logLevel >= 4) { logToWorkflow("exiting saveScreen()", "DEBUG", false); }
        return true;
    }    
    if (validationNeeded && !validateScreen(currScreen, currMVC)) {
        // TODO: Use the configured, localized warning message (%ERROR%)
        showAlertDialog("Error: Unable to save due to a validation failure");
        if (logLevel >= 4) { logToWorkflow("exiting saveScreen()", "DEBUG", false); }
        return false;
    }
    else {
        if (!customBeforeSave(currScreen)) {
            if (logLevel >= 4) { logToWorkflow("exiting saveScreen()", "DEBUG", false); }
            return false;
        }
        if (getCredInfo(currScreen)) {
            handleCredentialChange(currScreen);
        }
        updateMessageValueCollectionFromUI(currMVC, currScreen);
        customAfterSave(currScreen);
        if (logLevel >= 4) { logToWorkflow("exiting saveScreen()", "DEBUG", false); }
        return true;
    }
}

/**
 * Validates and saves the contents of all open screens, assuming that they validate successfully.
 * @returns True if validating and saving of all screens was successful, false otherwise.
 */
function saveScreens(skipValidation) {
    if (logLevel >= 4) { logToWorkflow("entering saveScreens()", "DEBUG", false); }
    var screenStack = [], listKeyStack = [];
    var success = true;
    var values;
    var passed = (skipValidation) ? true : validateAllScreens(); 
    if(!passed) {
        if (logLevel >= 4) { logToWorkflow("exiting saveScreens()", "DEBUG", false); }
        return false;
    } 
    var i;
    for (i = 0; i < previousScreenName.length; i++) {
        screenStack[i] = previousScreenName[i];
        listKeyStack[i] = listViewValuesKey[i];
        values = workflowMessage.getValues();
        var j;
        for (j = 0; j < listKeyStack.length; j++) {
            if (listKeyStack[j]) {
                values = narrowTo(values, listKeyStack[j]);
            }
        }
        success &= saveScreen(values, screenStack[i], false);
        if (!success) {
            if (logLevel >= 4) { logToWorkflow("exiting saveScreens()", "DEBUG", false); }
            return false;
        }
    }
    success &= saveScreen(getCurrentMessageValueCollection(), getCurrentScreen(), false);
    if (logLevel >= 4) { logToWorkflow("exiting saveScreens()", "DEBUG", false); }
    return success;
}

/****************** WORKFLOW NATIVE FUNCTIONS ************************/


/**
 * Sets the specified screen's title, by default based on its sup_screen_title attribute value.
 * @param screenKeyName The screen
 * @param screenTitle An explicit screen title to use rather than the sup_screen_title attribute value. Optional.
 */
function setScreenTitle(screenKeyName, screenTitle) {
    if (logLevel >= 4) { logToWorkflow("entering setScreenTitle()", "DEBUG", false); }
    if (!screenTitle) {
        var curScreenDivId = screenKeyName + "ScreenDiv";
        var curScreenDiv = document.getElementById(curScreenDivId);
        screenTitle = getAttribute(curScreenDiv, "sup_screen_title");
    }
    
    if (isWindows()) {
        document.title = screenTitle; 
    }      
    else {
        if (isWindowsMobile()) {
            var xmlhttp = getXMLHTTPRequest();
            xmlhttp.open("POST", "/sup.amp?querytype=setscreentitle&" + versionURLParam, false);
            xmlhttp.send("title=" + encodeURIComponent(screenTitle));
        }
        else if (isIOS()) {
            var xmlHttpReq = getXMLHTTPRequest();
            xmlHttpReq.open("GET", "http://localhost/sup.amp?querytype=setscreentitle&" + versionURLParam + "&title=" + encodeURIComponent(screenTitle), true);
            xmlHttpReq.send("");
        }
        else if (isAndroid()) {
            var request = "http://localhost/sup.amp?querytype=setscreentitle&" + versionURLParam + "&title=" + encodeURIComponent(screenTitle);
            _WorkflowContainer.getData(request);
        }        
        else { //must be BlackBerry
            var xmlhttp = getXMLHTTPRequest();
            xmlhttp.open("POST", "http://localhost/sup.amp?querytype=setscreentitle&" + versionURLParam, false);
            xmlhttp.send("title=" + encodeURIComponent(screenTitle));
        }
    }
    if (logLevel >= 4) { logToWorkflow("exiting setScreenTitle()", "DEBUG", false); }
}


/**
 * Closes the workflow application.
 */
function closeWorkflow() {
    if (logLevel >= 4) { logToWorkflow("entering closeWorkflow()", "DEBUG", false); }
    workflowMessage = "";
    supUserName = "";
    if (isWindowsMobile()) {
        addNativeMenuItemsForScreen("blank");
        showScreen("blank", curScreenKey, true);
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("GET", "/sup.amp?querytype=close&" + versionURLParam, false);
        try {
            xmlhttp.send("");
        }
        catch (e) { }
    }
    else if (isIOS()) {
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("GET", "http://localhost/sup.amp?querytype=close&" + versionURLParam, true);
        try {
            xmlhttp.send("");
        }
        catch (e) {}
    }
    else if (isAndroid()) {
        logToWorkflow("Closing Workflow" , "INFO");
        _WorkflowContainer.closeWorkflow();
    }         
    else {
        window.close();
    }
    if (!isBlackBerry()) {  //CR 661210-1
        if (logLevel >= 4) { logToWorkflow("exiting closeWorkflow()", "DEBUG", false); }
    }
}


/**
 * Allows the user to add a menuitem with the specified name and with the specified
 * callback, which will be invoked when the menuitem is clicked.
 * @param menuItemName The specified menuitem name.
 * @param functionName The specified callback name.
 * @param subMenuName The specific sub-menu name for Windows Mobile. Optional.
 * @param screenToShow The screen about to be shown. Optional.
 * @param menuItemKey The menuItem's key.
 */
function addMenuItem(menuItemName, functionName, subMenuName, screenToShow, menuItemKey) {
    if (logLevel >= 4) { logToWorkflow("entering addMenuItem()", "DEBUG", false); }
    //first add the item to sup_menuitems
    var div = document.getElementById(screenToShow + "ScreenDiv");
    var menuStr = div.getAttribute("sup_menuitems");
    var idxOfMenuItemName = menuStr.indexOf(menuItemName);
    if (idxOfMenuItemName != -1) {
        return;
    }
    var comma = (menuStr.length > 0) ? "," : "";
    menuStr = menuStr + comma + menuItemName + "," + menuItemKey;
    try {
        div.setAttribute("sup_menuitems", menuStr);  //has no affect on Windows Mobile
    }
    catch (e) {
    }

    var request = "menuitemname=" + encodeURIComponent(menuItemName);
    request += ("&onmenuclick=" + encodeURIComponent(functionName) + "()");
    if (isWindowsMobile()) {
        request += "&submenuname=";
        if (subMenuName) {
            request += encodeURIComponent(subMenuName);
        }
        else {
            if (resources) {
                request += encodeURIComponent(resources.getString("MENU"));
            }
            else {
                request += "Menu";
            }
        }
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("POST", "/sup.amp?querytype=addMenuItem&" + versionURLParam, false);
        xmlhttp.send(request);
    }
    else if (isAndroid()) {
         _WorkflowContainer.postData("http://localhost/sup.amp?querytype=addMenuItem&" + versionURLParam, request);
    }    
    else if (isBlackBerry()) {
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("POST", "http://localhost/sup.amp?querytype=addMenuItem&" + versionURLParam, false);
        xmlhttp.send(request);
    }    
    else {
        var curScreenDivId = ((screenToShow) ? screenToShow : getCurrentScreen()) + "ScreenDiv";
        var curScreenDiv = document.getElementById(curScreenDivId);
        if (hasjQueryMobile) {
             var divs = curScreenDiv.getElementsByTagName('div');
        	 var menuEl = curScreenDiv.getElementsByTagName('div')[0];
        	 //This is header div, check to see if we can add it into header.
        	 if ( menuEl.getElementsByTagName('a').length < 2  ) {
        		 menuEl.innerHTML = menuEl.innerHTML + '<a href="javascript:void(0)" id="'+ curScreenDivId +menuItemName + '" name="'
                 + menuItemName + '"' + ' onclick="' + functionName + '();">' + menuItemName + '</a>';
        	 }else {
        		
        		 //First try to find footer
        		 for( var divIdx = 0; divIdx < divs.length; divIdx++ ) {
        			 if ( divs[ divIdx].getAttribute('data-role') === 'footer'){
        				 menuEl = divs[ divIdx]; //This should be footer
        			
        				 //Check to see if it's realdy existing.
        				 var existLinks =  menuEl.getElementsByTagName('a')
        				for( var id =0; id <existLinks.length; id++ ) {
        					if ( existLinks[id].getAttribute('id') === (curScreenDivId +menuItemName) ){
        						var screenId = ((screenToShow) ? screenToShow : getCurrentScreen()) ;
        						alert("The menu to be added from your custom code uses the same menu key another menu on the same screen is using. The key was '"+  menuItemName + "' on '"+ screenId +"' screen.  Please change the menu key and try again");
        				        return;
        					}
        				}
        
        				 var newlink =  document.createElement('a');
        				 newlink.setAttribute('href', 'javascript:void(0)');
        				 newlink.setAttribute('class', 'invisible_button');
        				 newlink.setAttribute('data-role', 'menu'); 
        				 newlink.setAttribute('id',  curScreenDivId +menuItemName );
        				 newlink.setAttribute('name', menuItemName);
        				 newlink.setAttribute('onclick', functionName + '();');
        				 newlink.innerHTML= menuItemName ;
        			      menuEl.appendChild(newlink);
                		 break;
        			 }
        		 }
        	}
         	 
        }
        else {
            var menuEl = document.getElementById(curScreenDivId + "Menu");
            if (menuEl) {
                menuEl.innerHTML = menuEl.innerHTML + '<li><a class="nav" href="javascript:void(0)"' + ' name="'
                    + menuItemName + '"' + ' onclick="' + functionName + '();">' + menuItemName + '</a></li>';
            }
        }
    }        
    if (logLevel >= 4) { logToWorkflow("exiting addMenuItem()", "DEBUG", false); }
}
/**
 * Removes a menuitem from the specified screen with specified name
 * Note that for native menu items, the next time the screen is navigated to, the menu item will not be added.
 * For the platforms without native menu items, the menu item is removed immeditately.
 * This method is not supported on Windows Mobile 6.x
 * @param screenKey The key name of the screen that the contains the menu item to be removed
 * @param menuItemName The menuitem name to be removed
 */
function removeMenuItem(screenKey, menuItemName) {
    //remove the menu item from the div attribute sup_menuitems which is used in addNativeMenuItemsForScreen
    try {
        var div = document.getElementById(screenKey + "ScreenDiv");
        var menuStr = div.getAttribute("sup_menuitems");
        var idxOfMenuItemName = menuStr.indexOf(menuItemName);
        if ( idxOfMenuItemName < 0 ) {
            return ; //We couldn't find the menu , it might be already removed by user.
        }
        var idxOfEndOfMenuItem = menuStr.indexOf(",", idxOfMenuItemName + menuItemName.length + 1);
        idxOfEndOfMenuItem = (idxOfEndOfMenuItem === -1) ? menuStr.length : idxOfEndOfMenuItem + 1;
        menuStr = menuStr.substring(0, idxOfMenuItemName) + menuStr.substring(idxOfEndOfMenuItem);
        menuStr = (menuStr.lastIndexOf(",") === menuStr.length - 1) ? menuStr.substring(0, menuStr.length - 1) : menuStr;
        div.setAttribute("sup_menuitems", menuStr);  //has no affect on Windows Mobile

        //remove the menu anchors used on the iOS platform (non native menus) and on Desktop browsers
        var a = document.getElementsByName(menuItemName)[0];
        if (isJQueryMobileLookAndFeel) {
            a.parentNode.removeChild(a)
        }
        else {
            a.parentNode.parentNode.removeChild(a.parentNode);
        }
    }
    catch (e) {};
}

/**
 * Removes all native menu items.
 */
function removeAllMenuItems() {
    if (logLevel >= 4) { logToWorkflow("entering removeAllMenuItems()", "DEBUG", false); }
    if (isAndroid()) {
        _WorkflowContainer.getData("http://localhost/sup.amp?querytype=removeallmenuitems&" + versionURLParam);    
    }    
    else if (isWindowsMobile()) {
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("GET", "/sup.amp?querytype=removeallmenuitems&" + versionURLParam, false);
        xmlhttp.send("");
    }else if ( isIOS()){
         // Get current screen and find header and footer , then remove all the buttons on the header/footer bars.   
    	 var curScreenDivId = getCurrentScreen() + "ScreenDiv";
         var curScreenDiv = document.getElementById(curScreenDivId);
         if (hasjQueryMobile) {
              var divs = curScreenDiv.getElementsByTagName('div');
         	  var menuEl = curScreenDiv.getElementsByTagName('div')[0];
         	 //This is header div, check to see if we can add it into header.
         	 var headerBts = menuEl.getElementsByTagName('a');
         	 var length = headerBts.length;
         	 var keepCancelBt = false;
         	 for( var i = 0; i < length ; i++ ) {
         			 $( headerBts[0]).remove();
        	 }
         	 
         	 for( var divIdx = 0; divIdx < divs.length; divIdx++ ) {
    			 if ( divs[ divIdx].getAttribute('data-role') === 'footer'){
    				 menuEl = divs[ divIdx]; //This should be footer
    				 var footerBts = menuEl.getElementsByTagName('a');
    				 var length = footerBts.length;
    				 for( var i = 0; i <length; i++ ) {
    	         		 $( footerBts[0]).remove()
    	         	 }
                     $(menuEl).css('display',"none");
                     break;
    			 }
         	 }
         }else {
             var uls = curScreenDiv.getElementsByTagName('ul');
        	 for( var i =0; i < uls.length ; i++ )
        	 {
        		var cls =  uls[i].getAttribute('class') ;
        		if ( cls === 'menu')
        		{
        			uls[i].innerHTML= "";
        			break;
        		}	
        	 }
         }
    }
    else {
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("GET", "http://localhost/sup.amp?querytype=removeallmenuitems&" + versionURLParam, isIOS());
        xmlhttp.send("");
    }
    if (logLevel >= 4) { logToWorkflow("exiting removeAllMenuItems()", "DEBUG", false); }
}

/**
 * Allows the user to clear the contents of the on-device request result cache for the current
 * Workflow.
 */
function clearCache() {
    if (logLevel >= 4) { logToWorkflow("entering clearCache()", "DEBUG", false); }
    if(isWindowsMobile()) {
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("POST", "/sup.amp?querytype=clearrequestcache&" + versionURLParam, false);
        xmlhttp.send("");
    }
    else if (isAndroid()) {
        _WorkflowContainer.getData("http://localhost/sup.amp?querytype=clearrequestcache&" + versionURLParam);    
    }    
    else {
    	// 691822 - Add try catch block because iOS and BB will throw an exception.
    	try {
        	var xmlhttp = getXMLHTTPRequest();
        	xmlhttp.open("POST", "http://localhost/sup.amp?querytype=clearrequestcache&" + versionURLParam, false);
        	xmlhttp.send("");
        	}
    	catch (e) { }
    }
    if (logLevel >= 4) { logToWorkflow("exiting clearCache()", "DEBUG", false); }
}


/**
 * Allows the user to clear an item from the contents of the on-device request result cache
 * for the current Workflow.
 * @param cachekey The key for the item to be removed. See Workflow.js for details on how to construct it.
 */
function clearCacheItem( cachekey ) {
    if (logLevel >= 4) { logToWorkflow("entering clearCacheItem()", "DEBUG", false); }
    var request = "cachekey=" + encodeURIComponent(cachekey);
   
    if (isWindowsMobile()) {
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("POST", "/sup.amp?querytype=clearrequestcacheitem&" + versionURLParam, false);
        xmlhttp.send(request);
    }
    else if (isAndroid()) {
       _WorkflowContainer.postData("http://localhost/sup.amp?querytype=clearrequestcacheitem&" + versionURLParam, request);    
    } 
    else {
    	// 691822 - Add try catch block because iOS and BB will throw an exception.
    	try {
        	var xmlhttp = getXMLHTTPRequest();
        	xmlhttp.open("POST", "http://localhost/sup.amp?querytype=clearrequestcacheitem&" + versionURLParam, false);
        	xmlhttp.send( request );
    	}
    	catch (e) { }
    }
    if (logLevel >= 4) { logToWorkflow("exiting clearCacheItem()", "DEBUG", false); }
}

/**
 * Allows the user to log a message to the device trace log which can be remotely retrieved
 * from the server. Whether the message actually gets logged will depend on how the
 * log level that the administrator has selected for this device user corresponds with the
 * log level of this message.
 * @param sMsg Message to be logged
 * @param eLevel Level to be logged at ("ERROR", "WARN", "INFO" or "DEBUG")
 * @param notifyUser If true, will display an alert dialog before logging.
 */
function logToWorkflow(sMsg, eLevel, notifyUser) {
    if (notifyUser) {
        showAlertDialog(sMsg);
    }
    var msgLogLevel;
    switch (eLevel) {
        case "ERROR":
            msgLogLevel = 1;
            break;
        case "WARN":
            msgLogLevel = 2;
            break;
        case "INFO":
            msgLogLevel = 3;
            break;
        case "DEBUG":
            msgLogLevel = 4;
            break;
        default:
            msgLogLevel = 1;
    }
    if((sMsg === "") || (msgLogLevel > logLevel) || (isWindows())) {
        return;
    }
    var request;
    if (isWindowsMobile()) {
        request = "loglevel=" + msgLogLevel + "&logmessage=" + encodeURIComponent(sMsg);
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("POST", "/sup.amp?querytype=logtoworkflow&" + versionURLParam, false);
        try {
            xmlhttp.send(request);
        }
        catch (e2) { }
    }
    else if (isAndroid()) {
        _WorkflowContainer.logToWorkflow(sMsg, msgLogLevel);
    }        
    else {
        request = "loglevel=" + msgLogLevel + "&logmessage=" + encodeURIComponent(sMsg);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "http://localhost/sup.amp?querytype=logtoworkflow&" + versionURLParam, false);
        try {
            xmlhttp.send(request);
        }
        catch (e) {}
    }
}
/**
 * Opens a form on the device that allows the user to specify the credentials through the use
 * of certificate-based authentication.
 */
function showCertificatePicker() {
    if (logLevel >= 4) { logToWorkflow("entering showCertificatePicker()", "DEBUG", false); }
    if (isWindowsMobile() || isWindows()) {
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("GET", "/sup.amp?querytype=showcertpicker&" + versionURLParam, false);
        try {
            xmlhttp.send("");
        }
        catch (e2) { }
    }
    else if (isAndroid()) {
        _WorkflowContainer.getData("http://localhost/sup.amp?querytype=showcertpicker&" + versionURLParam);
    }    
    else {
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("GET", "http://localhost/sup.amp?querytype=showcertpicker&" + versionURLParam, isIOS());
        try {
            xmlhttp.send("");
        }
        catch (e) {}
    }
    if (logLevel >= 4) { logToWorkflow("exiting showCertificatePicker()", "DEBUG", false); }
}

/**
 * Save login credentials from a certificate.  The common name is used for the
 * username.  The signed certificate is used for the password.  
 * @param certificate
 * @since 2.1.2
 */
function saveLoginCertificate(certificate) {
    if (logLevel >= 4) { logToWorkflow("entering saveLoginCertificate()", "DEBUG", false); }
	
    saveLoginCredentials(certificate.subjectCN, certificate.signedCertificate, true);

	if (logLevel >= 4) { logToWorkflow("exiting saveLoginCertificate()", "DEBUG", false); }
}

/**
 * Save login credentials to the credential cache.
 * @param userName The user name to save
 * @param password The password to save
 * @since 2.1.2
 */
function saveLoginCredentials(userName, password) {
    if (logLevel >= 4) { logToWorkflow("entering saveLoginCredentials()", "DEBUG", false); }

    var requestData = "supusername=" + encodeURIComponent(userName) + "&suppassword=" + encodeURIComponent(password);

    if (isWindowsMobile()) {
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("POST", "/sup.amp?querytype=savecredential&" + versionURLParam, true);
        xmlhttp.send(requestData);
    }
    else if (isAndroid()) {
        _WorkflowContainer.saveCredentials( userName, password );
    }
    else
    {
        // BlackBerry and iOS
        var xmlHttpReq = getXMLHTTPRequest();
        xmlHttpReq.open("POST", "http://localhost/sup.amp?querytype=savecredential&" + versionURLParam, true);
        xmlHttpReq.send(requestData);
    }

    if (logLevel >= 4) { logToWorkflow("exiting saveLoginCredentials()", "DEBUG", false); }
}

/**
 * Open the supplied URL in the browser.
 */
function showUrlInBrowser(url)
{
    if (logLevel >= 4) { logToWorkflow("entering showInBrowser()", "DEBUG", false); }
    url = trimSpaces(url, true);
    var idxOfColon = url.indexOf(":");
    if (idxOfColon == -1 || (idxOfColon > 7)) {
        url = "http://" + url;
    }
    
    if (isWindowsMobile()) {
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("GET", "/sup.amp?querytype=showInBrowser&" + versionURLParam + "&url=" + encodeURIComponent(url), false );
        xmlhttp.send("");
    }
    else if (isAndroid()) {
        _WorkflowContainer.getData("http://localhost/sup.amp?querytype=showInBrowser&" + versionURLParam + "&url=" + encodeURIComponent(url));
    } 
    else if (isIOS() || isBlackBerry()) {
        if ( isIOS() &&  iScroller !== null ){ //CR#700698-1
             iScroller.setPosition(0,0,true);
        }

        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("GET", "http://localhost/sup.amp?querytype=showInBrowser&" + versionURLParam + "&url=" + encodeURIComponent(url), true);
        xmlhttp.send("");
    }
    else {
        window.open(url);
    }
    if (logLevel >= 4) { logToWorkflow("exiting showInBrowser()", "DEBUG", false); }
}


/**
 * Shows the given file contents in a content-appropriate way. The type of the content is
 * supplied by either the MIME type or the filename, at least one of which must be supplied.
 * The content itself should be presented as a base64-encoded string.
 * @param contents The base-64 encoded version of the binary content of the attachment to be displayed
 * @param mimeType The MIME type of the file. Optional.
 * @param fileName The name of the file. Optional.
 */
function showAttachmentContents(contents, mimeType, fileName) {
    if (logLevel >= 4) { logToWorkflow("entering showAttachment()", "DEBUG", false); }
    var request = "";
    if (!isWaitDialogShown()) {
        var dlgid = guid();
        request += "callback=closeWaitDialog&dialogid=" + dlgid;
        openWaitDialog("Please wait...", "Cancel", dlgid);
    } else {
        request += "callback=closeWaitDialog&dialogid=wait";
    }
    if (isWindowsMobile()) {
        contents = contents.replace(/=/g, "~");
        request += "&Attachmentdata=" + contents;
    } else {
        request += "&Attachmentdata=" + encodeURIComponent(contents);
    }
    if (mimeType) {
        request += "&mimetype=" + encodeURIComponent(mimeType);
    }
    if (fileName) {
       request += "&filename=" + encodeURIComponent(fileName);
    }
    if(isWindowsMobile()) {
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("POST", "/sup.amp?querytype=showattachment&" + versionURLParam, false );
        xmlhttp.send(request);
    }
    else if (isAndroid()) {
        _WorkflowContainer.postData("http://localhost/sup.amp?querytype=showattachment&" + versionURLParam, request);
    }   
    else {
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("POST", "http://localhost/sup.amp?querytype=showattachment&" + versionURLParam, true);
        xmlhttp.send(request);
    }    
    if (logLevel >= 4) { logToWorkflow("exiting showAttachment()", "DEBUG", false); }
}


/**
 * Shows the given file contents in a content-appropriate way. The type of the content is
 * supplied by either the MIME type or the filename, at least one of which must be supplied.
 * The content itself will be a unique key supplied earlier to a call to doAttachmentDownload.
 * @param uniqueKey The unique key for the attachment.
 * @param mimeType The MIME type of the file. Optional.
 * @param fileName The name of the file. Optional.
 */
function showAttachmentFromCache(uniqueKey, mimeType, fileName) {
    if (logLevel >= 4) { logToWorkflow("entering showAttachment()", "DEBUG", false); }
    var request = "";
    if (!isWaitDialogShown()) {
        var dlgid = guid();
        request += "callback=closeWaitDialog&dialogid=" + dlgid;
        openWaitDialog("Please wait...", "Cancel", dlgid);
    } else {
        request += "callback=closeWaitDialog&dialogid=wait";        
    }
    request += "&uniquekey=" + encodeURIComponent(uniqueKey);
    if (mimeType) {
        request += "&mimetype=" + encodeURIComponent(mimeType);
    }
    if (fileName) {
       request += "&filename=" + encodeURIComponent(fileName);
    }
    if(isWindowsMobile()) {
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("POST", "/sup.amp?querytype=showattachment&" + versionURLParam, false);
        xmlhttp.send(request);
    }
    else if (isAndroid()) {
        _WorkflowContainer.postData("http://localhost/sup.amp?querytype=showattachment&" + versionURLParam, request);
    } 
    else {
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("POST", "http://localhost/sup.amp?querytype=showattachment&" + versionURLParam, true);
        xmlhttp.send(request);
    }    
    if (logLevel >= 4) { logToWorkflow("exiting showAttachment()", "DEBUG", false); }
}

/**
 * Shows a local attachment.
 * @param key The key
 */
function showLocalAttachment(key) {
    if (logLevel >= 4) { logToWorkflow("entering showLocalAttachment()", "DEBUG", false); }
    if (isWindowsMobile()) {
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("GET", "/sup.amp?querytype=showlocalattachment&" + versionURLParam + "&key=" + encodeURIComponent(key), false );
        xmlhttp.send("");
    }
    else if (isAndroid()) {
        _WorkflowContainer.getData("http://localhost/sup.amp?querytype=showlocalattachment&" + versionURLParam + "&key=" + encodeURIComponent(key));
    } 
    else if (isBlackBerry()) {
        window.location = "http://localhost/" + key;
    }
    else if (isIOS()) {
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("GET", "http://localhost/sup.amp?querytype=showlocalattachment&" + versionURLParam + "&key=" + encodeURIComponent(key), true);
        xmlhttp.send("");
    }
    else {
        window.open(key);
    }
    if (logLevel >= 4) { logToWorkflow("exiting showLocalAttachment()", "DEBUG", false); }
}


/**
 * Allows the user to cause an operation/object query to be invoked.
 * @param screenKey The specified screen that the submit is occurring on.
 * @param requestAction The specified action for the submit.
 * @param timeout Specifies the time, in seconds, to wait before giving up waiting for a response.
 * @param cacheTimeout Specifies the time, in seconds, since the last invocation with the same input parameter values to use the same response as previously retrieved without making a new call to the server.
 * @param errorMessage Specifies the string to display if an online request fails.
 * @param errorCallback Name of the function to be called if an online request fails.
 * @param workflowMessageToSend Workflow message that will be sent as the input in an online request.
 * @param cacheKey String used as the key for this request in the on-device request result cache.
 */
function doOnlineRequest(screenKey, requestAction, timeout, cacheTimeout, errorMessage, errorCallback, workflowMessageToSend, cacheKey) {
    if (logLevel >= 4) { logToWorkflow("entering doOnlineRequest()", "DEBUG", false); }
    try {
        if (disableControls) {
            var resubmitMessage = "This workflow has already been processed";  //TODO localize this
            showAlertDialog(resubmitMessage);
            if (logLevel >= 4) { logToWorkflow("exiting doOnlineRequest()", "DEBUG", false); }
            return false;
        }
        if (!customBeforeSubmit(screenKey, requestAction, workflowMessageToSend)) {
            if (logLevel >= 4) { logToWorkflow("exiting doOnlineRequest()", "DEBUG", false); }
            return false;
        }
        var request = "xmlWorkflowMessage=" + encodeURIComponent(workflowMessageToSend.serializeToString());
        var credInfo = getCredInfo();
        var xmlhttp;
        var response;
        if (credInfo) {
            request += ("&" + credInfo);
        }
        request += ("&cachekey=" + encodeURIComponent(cacheKey));
        if (timeout) {
            request += ("&rmitimeout=" + timeout);
        }
        if (cacheTimeout) {
            request += ("&RequestExpiry=" + cacheTimeout);
        }
        if (workflowMessageToSend.getHasFileMessageValue()) {
            request += ("&parse=true");
        }
        if (errorMessage) {
            var encodedMessage;
            if( isBlackBerry() ) {
                encodedMessage = encodeURIComponent(escape(errorMessage));
            } else {
                // This is a temporary fix for a bug in the container that calls
                // encodeURIComponent on the whole query string for Android.  See
                // IR 676161-2.
                encodedMessage = encodeURIComponent(errorMessage);
            }
            request += ("&onErrorMsg=" + encodedMessage);
        }
        if (!errorCallback) {
            errorCallback = "reportRMIError";
        }
        request += ("&onErrorCallback=" + errorCallback);
        if (isWindowsMobile() || isWindows()) {
            //make xmlhttp request to load the rmi response from server
            xmlhttp = getXMLHTTPRequest();
            if (isWindows()) {
                xmlhttp.open("POST", "rmi.xml", false );
            }
            else {  
                xmlhttp.open("POST", "/sup.amp?querytype=rmi&" + versionURLParam, false );            
            }
            xmlhttp.send(request);
            //Win32 returns 200 for OK, WM returns 0 for OK
            if (xmlhttp.status === 200 || xmlhttp.status === 0) {
                response = xmlhttp.responseText;
                processWorkflowMessage(response);
            }
            else {
                logToWorkflow("Error:  Unable to retrieve the message from the server", "ERROR", true);
            }
        } 
        else if (isAndroid()) {
            var url = 'http://localhost/sup.amp?querytype=rmi&' + versionURLParam;
            var funcCall = "_WorkflowContainer.postData('" + url + "', '" +  request + "')";
            funcCall = "processWorkflowMessage(" + funcCall + ")";
            setTimeout(funcCall, 5);
        }  
        else { //BB and iPhone
            xmlhttp = getXMLHTTPRequest();   
            xmlhttp.open("POST", "http://localhost/sup.amp?querytype=rmi&" + versionURLParam, true);            
            
             if (isBlackBerry()) {
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState === 4) {
                        if (xmlhttp.status === 200) {
                            response = xmlhttp.responseText;
                            processWorkflowMessage(response);
                        }
                    }
                };
            }
            try {
                xmlhttp.send(request);
            }
            catch (excep1) {
                logToWorkflow("Error:  Unable to retrieve the message from the server", "ERROR", true);
            }
        }                      
        customAfterSubmit(screenKey, requestAction);
    }
    catch (excep) {
        logToWorkflow("Error: " + excep.message, "ERROR", true);
    }
    if (logLevel >= 4) { logToWorkflow("exiting doOnlineRequest()", "DEBUG", false); }
}


/**
 * Allows the user to cause an operation/object query to be invoked.
 * @param screenKey The specified screen that the submit is occurring on.
 * @param requestAction The specified action for the submit.
 * @param workflowMessageToSend Workflow message that will be sent as the input in an online request.
 * @param attachmentKey The specified key of the result will not be returned in the workflow message but will, instead, be stored on the device for later access.
 * @param requestGUID Represents a unique key that can be used to store/access the cached key value from the request results.
 * @param downloadCompleteCallback A function that will be invoked when the cached value has been downloaded to the device and is ready to be accessed.
 */
function doAttachmentDownload(screenKey, requestAction, workflowMessageToSend, attachmentKey, requestGUID, downloadCompleteCallback) {
    if (logLevel >= 4) { logToWorkflow("entering doAttachmentDownload()", "DEBUG", false); }
    try {
        if (disableControls) {
            var resubmitMessage = "This workflow has already been processed";  //TODO localize this
            showAlertDialog(resubmitMessage);
            if (logLevel >= 4) { logToWorkflow("exiting doAttachmentDownload()", "DEBUG", false); }
            return false;
        }
        if (!customBeforeSubmit(screenKey, requestAction)) {
            if (logLevel >= 4) { logToWorkflow("exiting doAttachmentDownload()", "DEBUG", false); }
            return false;
        }
        var request = "xmlWorkflowMessage=" + encodeURIComponent(workflowMessageToSend.serializeToString());
        var credInfo = getCredInfo();
        var xmlhttp;
        var response;
        if (credInfo) {
            request += ("&" + credInfo);
        }
        request += ("&attachmentkey=" + attachmentKey);
        request += ("&uniquekey=" + requestGUID);
        request += ("&ondownloadcomplete=" + downloadCompleteCallback);
        if (isWindowsMobile() || isWindows()) {
            xmlhttp = getXMLHTTPRequest();
            xmlhttp.open("POST", "/sup.amp?querytype=downloadattachment&" + versionURLParam, true );
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState === 4) {
                    if (xmlhttp.status === 200) {
                        window[downloadCompleteCallback].call(this, decodeURIComponent(requestGUID), xmlhttp.responseText);
                    }
                }
            };
            try {
                xmlhttp.send(request);          
            }
            catch (e3) {}                                
        }
        else if (isAndroid()) {
            _WorkflowContainer.postData("http://localhost/sup.amp?querytype=downloadattachment&" + versionURLParam, request);
        }   
        else {
            xmlhttp = getXMLHTTPRequest();
            xmlhttp.open("POST", "http://localhost/sup.amp?querytype=downloadattachment&" + versionURLParam, true);
            if (isBlackBerry()) {
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState === 4) {
                        if (xmlhttp.status === 200) {
                            window[downloadCompleteCallback].call(this, decodeURIComponent(requestGUID), xmlhttp.responseText);
                        }
                    }
                };
            }
            try {
                xmlhttp.send(request);
            }
            catch (e1) {}
        }
        customAfterSubmit(screenKey, requestAction);
    }
    catch (excep) {
        logToWorkflow("Error: " + excep.message, "ERROR", true);
    }
    if (logLevel >= 4) { logToWorkflow("exiting doAttachmentDownload()", "DEBUG", false); }
}


/**
 * Allows the user to cause an operation/object query to be invoked. Will close the workflow application when finished.
 * @param screenKey The specified screen that the submit is occurring on.
 * @param requestAction The specified action for the submit.
 * @param submitMessage Specifies the string to display if an asynchronous request is successfully submitted.
 * @param resubmitMessage Specifies the string to display if an asynchronous request is will not be submitted because the workflow has already been processed.
 * @param keepOpen Do not call closeWorkflow() 
 */
function doSubmitWorkflow(screenKey, requestAction, submitMessage, resubmitMessage, keepOpen) {
    if (logLevel >= 4) { logToWorkflow("entering doSubmitWorkflow()", "DEBUG", false); }
    try {
        if (disableControls) {
            resubmitMessage = resubmitMessage ? resubmitMessage : "This workflow has already been processed";  //TODO localize this
            showAlertDialog(resubmitMessage);
            if (logLevel >= 4) { logToWorkflow("exiting doSubmitWorkflow()", "DEBUG", false); }
            return false;
        }
        if (!customBeforeSubmit(screenKey, requestAction)) {
            if (logLevel >= 4) { logToWorkflow("exiting doSubmitWorkflow()", "DEBUG", false); }
            return false;
        }
        var workflowMessageToSend = workflowMessage;
        workflowMessageToSend.setWorkflowScreen(screenKey);
        workflowMessageToSend.setRequestAction(requestAction);
        var request = "xmlWorkflowMessage=" + encodeURIComponent(workflowMessageToSend.serializeToString());
        var credInfo = getCredInfo();
        if (getCredInfo()) {
            handleCredentialChange();
        }
        var xmlhttp;
        if (credInfo) {
            request += ("&" + credInfo);
        }
        if (workflowMessageToSend.getHasFileMessageValue()) {
            request += ("&parse=true");
        } 
        if (isWindowsMobile() || isWindows()) {
            xmlhttp = getXMLHTTPRequest();
            xmlhttp.open("POST", "/sup.amp?querytype=submit&" + versionURLParam, false);
                         
             try {
                xmlhttp.send(request);
            }
            catch (e3) { }
        }
        else if (isAndroid()) {
            _WorkflowContainer.postData("http://localhost/sup.amp?querytype=submit&" + versionURLParam, request);
        } 
        else {
            xmlhttp = getXMLHTTPRequest();
            xmlhttp.open("POST", "http://localhost/sup.amp?querytype=submit&" + versionURLParam, false);            
            try {
                xmlhttp.send(request);
            }
            catch (e2) {}
        }
        if (submitMessage) {
            showAlertDialog(submitMessage); 
        }
        customAfterSubmit(screenKey, requestAction);
        if (!keepOpen) {
            closeWorkflow();
        }
    }
    catch (excep) {
        logToWorkflow("Error: " + excep.message, "ERROR", true);
    }
    if (!isBlackBerry()) {  //CR 661210-1
        if (logLevel >= 4) { logToWorkflow("exiting doSubmitWorkflow()", "DEBUG", false); }
    }
}


function doActivateWorkflow(screenKey, requestAction) {
    if (logLevel >= 4) { logToWorkflow("entering doActivateWorkflow()", "DEBUG", false); }
    try {
        activationScreen = null;
        if (!customBeforeSubmit(screenKey, requestAction)) {
            if (logLevel >= 4) { logToWorkflow("exiting doActivateWorkflow()", "DEBUG", false); }
            return;
        }
        var workflowMessageToSend = workflowMessage;
        workflowMessageToSend.setWorkflowScreen(screenKey);
        workflowMessageToSend.setRequestAction(requestAction);
        var request = "xmlWorkflowMessage=" + encodeURIComponent(workflowMessageToSend.serializeToString());
        var credInfo = getCredInfo();
        var xmlhttp;
        if (credInfo) {
            request += ("&" + credInfo);
            clearCredentialPassword();
        }
        if (isWindowsMobile() || isWindows()) {
            xmlhttp = getXMLHTTPRequest();
            xmlhttp.open("POST", "/sup.amp?querytype=activate&" + versionURLParam, false);
             try {
                xmlhttp.send(request);
            }
            catch (e3) { }
        }
        else if (isAndroid()) {
            _WorkflowContainer.postData("http://localhost/sup.amp?querytype=activate&" + versionURLParam, request);
        } 
        else {
            xmlhttp = getXMLHTTPRequest();
            xmlhttp.open("POST", "http://localhost/sup.amp?querytype=activate&" + versionURLParam, false);            
            try {
                xmlhttp.send(request);
            }
            catch (e2) {}
        }
        previousScreenName = [];  //remove all the previous screens from the stack
        workflowMessage = new WorkflowMessage("");  //keys set on the activation screen should not available
        if (defaultScreen === "null" && !loadTransformData) { //CR 695381 a server intiated activation screen opened from the client initiated area of HWC 
            closeWorkflow();                
        }
        else if (credentialsScreen) {
            navigateForward(credentialsScreen, null, null, true);
        }
        else if (loadTransformData) {
            if (credentialRefresh) {  //server notification, dynamic credentials, shared activation and credential screen
                closeWorkflow();
                return;
            }
            else {
                origScreenKey = screenKey;
                setCurrentScreen(SERVERINITIATEDFLAG);            
                processWorkflowMessage(origIncomingWorkflowMessage, origNoUI, origLoading, true); 
                origIncomingWorkflowMessage = null;
            }
        }
        else {
            navigateForward(defaultScreen, null, null, true);
        }        
        customAfterSubmit(screenKey, requestAction);
    }
    catch (excep) {
        alert("Error: " + excep.message);
    }
    if (logLevel >= 4) { logToWorkflow("exiting doActivateWorkflow()", "DEBUG", false); }
}

function doCredentialsSubmit(screenKey, requestAction) {
    if (logLevel >= 4) { logToWorkflow("entering doCredentialsSubmit()", "DEBUG", false); }
    try {
        if (!customBeforeSubmit(screenKey, requestAction)) {
            if (logLevel >= 4) { logToWorkflow("exiting doCredentialsSubmit()", "DEBUG", false); }
            return;
        }
        var workflowMessageToSend = workflowMessage;
        workflowMessageToSend.setWorkflowScreen(screenKey);
        workflowMessageToSend.setRequestAction(requestAction);
        var request = "xmlWorkflowMessage=" + encodeURIComponent(workflowMessageToSend.serializeToString());
        var credInfo = getCredInfo();
        var xmlhttp;
        if (credInfo) {
            request += ("&" + credInfo);
        }
        if (isWindowsMobile() || isWindows()) {
            xmlhttp = getXMLHTTPRequest();
            xmlhttp.open("POST", "/sup.amp?querytype=credentials&" + versionURLParam, false);
                         
             try {
                xmlhttp.send(request);
            }
            catch (e3) { }
        }
        else if (isAndroid()) {
            _WorkflowContainer.postData("http://localhost/sup.amp?querytype=credentials&" + versionURLParam, request);
        } 
        else {
            xmlhttp = getXMLHTTPRequest();
            xmlhttp.open("POST", "http://localhost/sup.amp?querytype=credentials&" + versionURLParam, false);            
            try {
                xmlhttp.send(request);
            }
            catch (e2) {}
        }
        if (credentialRefresh) {  //we are here because of an async credential failure
            customAfterSubmit(screenKey, requestAction);
            closeWorkflow();
            if (!isBlackBerry()) {  //CR 661210-1
                if (logLevel >= 4) { logToWorkflow("exiting doCredentialsSubmit()", "DEBUG", false); }
            }
            return;
        }
        clearCredentialPassword();
        if (credentialsScreen) {  //we have a credentials starting point and are being directed to the credentials screen for the first time
            if (loadTransformData) {  //first time showing the credentials screen on a server initiated workflow.
                origScreenKey = screenKey;
                setCurrentScreen(SERVERINITIATEDFLAG);            
                processWorkflowMessage(origIncomingWorkflowMessage, origNoUI, origLoading, true); 
                origIncomingWorkflowMessage = null;
            }
            else {
                credentialsScreen = null;
                previousScreenName = [];  //remove all the previous screens from the stack
                workflowMessage = new WorkflowMessage("");  //keys set on the activation screen should not available
                navigateForward(defaultScreen, null, null, true);
            } 
        }
        else { //we are here because of a sync request on a server initiated flow that had a credential failure
            credentialsScreen = null;
            navigateBack(true);
        }
        customAfterSubmit(screenKey, requestAction);
    }
    catch (excep) {
        alert("Error: " + excep.message);
    }
    if (!isBlackBerry()) {  //CR 661210-1
        if (logLevel >= 4) { logToWorkflow("exiting doCredentialsSubmit()", "DEBUG", false); }
    }
}


/**
 * Shows an alert dialog
 * @param message The message to display
 * @param title The title to display. Optional.
 */
function showAlertDialog(message, title) {
    if (isIOS()) {
        var request = "http://localhost/sup.amp?querytype=alert&" + versionURLParam + "&message=" + encodeURIComponent(message);
        if (title) {
            request += ("&title=" + encodeURIComponent(title));
        }
        var xmlhttp = getXMLHTTPRequest();
        xmlhttp.open("GET", request, true);
        xmlhttp.send(request);
    }
    else {
        alert(message);
    }
}

/**
 * Shows a confirm dialog
 * @param message The message to display
 * @param title The title to display. Optional.
 */
function showConfirmDialog(message, title) {
    if (isIOS()) {
        var request = "http://localhost/sup.amp?querytype=confirm&version=2.0&message=" + encodeURIComponent(message);
        if (title) {
            request += ("&title=" + encodeURIComponent(title));
        }

        try {
            //make xmlhttp request to load the rmi response from server
            xmlhttp = getXMLHTTPRequest();
            xmlhttp.open("GET", request, true);               
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4) {
                    return (xmlhttp.responseText !== "No");
                }
            };
            xmlhttp.send();
        }
        catch (ex) {
            alert(ex);
            return true;
        }
    }
    else {
        return confirm(message);
    }
}
/****************** WORKFLOW VALIDATION FUNCTIONS ************************/

/**
 * Set the text for the help element.
 * @param helpField The help element
 * @param helpMessage The help message
 */
function setValidationText(helpField, helpMessage) {
    if (logLevel >= 4) { logToWorkflow("entering setValidationText()", "DEBUG", false); }
    if (helpField) {
        helpField.innerHTML = helpMessage;
    }
    if (logLevel >= 4) { logToWorkflow("exiting setValidationText()", "DEBUG", false); }
}

/**
 * Determines whether or not the specified value matches the specified regular expression.
 * @param val The specified value
 * @param rExp The specified regular expression
 * @param userSuppliedMsg The message to use if it does not match. Optional.
 * @param helpElement The help element. Optional.
 * @returns True if it matches, false if not.
 */
function validateRegularExpression(val, rExp, userSuppliedMsg, helpElement) {
    if (logLevel >= 4) { logToWorkflow("entering validateRegularExpression()", "DEBUG", false); }
    var helpMessage = "";
    var rc = true;
    var re = new RegExp(rExp);
    if (!re.test(val)) {
        helpMessage = userSuppliedMsg ? userSuppliedMsg : "regular expression " + rExp + " failed";
        rc = false;
    }
    setValidationText(helpElement, helpMessage);
    if (logLevel >= 4) { logToWorkflow("exiting validateRegularExpression()", "DEBUG", false); }
    return rc;
}

/**
 * Determines whether or not the specified value is a valid date.
 * @param val The specified value
 * @param required True if the value must be specified, false otherwise. Optional.
 * @param minValue The minimum allowable value. Optional.
 * @param maxValue The maximum allowable value. Optional.
 * @param userSuppliedMsg The message to use if it does not match. Optional.
 * @param helpElement The help element. Optional.
 * @returns True if it is valid, false if it is not.
 */
function validateDate(val, required, minValue, maxValue, userSuppliedMsg, helpElement) {
    if (logLevel >= 4) { logToWorkflow("entering validateDate()", "DEBUG", false); }
    var helpMessage = "";
    var rc = true;
    if (rc && required && (val.length === 0)) {
        rc = false;
        helpMessage = userSuppliedMsg ? userSuppliedMsg : "this value is required";
    }
    if (val.length > 0) {
        var d = Date.parse(val);
        if (d.toString() === "NaN") {
            val = val.replace(/-/gi, "/")
            d = Date.parse(val);
            if (d.toString() === "NaN") { 
                helpMessage = userSuppliedMsg ? userSuppliedMsg : "Invalid date. YYYY-MM-DD";
                rc = false;
            }
        }
        if (rc) {
            var splitChar = val.indexOf("-") === -1 ? "/" : "-";
            var year=val.split(splitChar)[0]
            var month=val.split(splitChar)[1]
            var day=val.split(splitChar)[2]
            var aDate = new Date(year, month-1, day);
            if ((aDate.getFullYear() != year) || (aDate.getMonth() + 1 != month) || (aDate.getDate() != day)) { //2011-02-31 catches the following as an invalid date
                helpMessage = userSuppliedMsg ? userSuppliedMsg : "Invalid date. YYYY-MM-DD";
                rc = false;
            }
        }        
        if (rc && minValue) {
            var minDate = getDateFromExpression(minValue);
            if (d < minDate) {
                helpMessage = userSuppliedMsg ? userSuppliedMsg : "Date must be greater than or equal to " + minValue ;
                rc = false;                
            }
        }
        if (rc && maxValue) {
            var maxDate = getDateFromExpression(maxValue);
            if (d > maxDate) {
                helpMessage = userSuppliedMsg ? userSuppliedMsg : "Date must be less than or equal to " + maxValue ;
                rc = false;                
            }
        }
    }
    setValidationText(helpElement, helpMessage);
    if (logLevel >= 4) { logToWorkflow("exiting validateDate()", "DEBUG", false); }
    return rc;
}


/**
 * Determines whether or not the specified value is a valid datetime.
 * @param val The specified value
 * @param required True if the value must be specified, false otherwise. Optional.
 * @param minValue The minimum allowable value. Optional.
 * @param maxValue The maximum allowable value. Optional.
 * @param userSuppliedMsg The message to use if it does not match. Optional.
 * @param helpElement The help element. Optional.
 * @returns True if it is valid, false if it is not.
 */
function validateDateTime(val, required, minValue, maxValue, userSuppliedMsg, helpElement) {
    if (logLevel >= 4) { logToWorkflow("entering validateDateTime()", "DEBUG", false); }
    //min or max value can be yyyy-mm-dd, yyyy-mm-ddThh:mm:ss, today, today+-seconds
    var helpMessage = "";
    var rc = true;
    if (rc && required && (val.length === 0)) {
        rc = false;
        helpMessage = userSuppliedMsg ? userSuppliedMsg : "this value is required";
    }
    var dateToday = new Date();
    var dateTodayMS = dateToday.getTime();
    var idxOfToday;
    var offset;
    if (val.length > 0) {
        if (minValue) { //convert now, today or today+-seconds into a value
            var idxOfNow = minValue.indexOf("now");
            if (idxOfNow === 0) {
                dateToday = convertLocalTimeToUtc(dateToday);
                minValue = getISODateTimeString(dateToday);
            }
            idxOfNow = maxValue.indexOf("now");
            if (idxOfNow === 0) {
                dateToday = convertLocalTimeToUtc(dateToday);
                maxValue = getISODateTimeString(dateToday);
            }
            
            idxOfToday = minValue.indexOf("today");
            if (idxOfToday === 0) {
                dateToday.setHours(12);
                dateToday.setMinutes(0);
                dateToday.setSeconds(0);
                dateToday.setMilliseconds(0);
                if (minValue.length > 5) {
                    offset = minValue.substring(5);
                    offset = offset.replace("+", "");
                    dateTodayMS = dateTodayMS + offset * 1000;
                    dateToday.setTime(dateTodayMS);
                }
                dateToday = convertLocalTimeToUtc(dateToday);
                minValue = getISODateTimeString(dateToday);
            }
        }
        if (maxValue) { //convert today or today+-seconds into a value
            idxOfToday = maxValue.indexOf("today");
            if (idxOfToday === 0) {
                dateToday.setHours(12);
                dateToday.setMinutes(0);
                dateToday.setSeconds(0);
                dateToday.setMilliseconds(0);
                if (maxValue.length > 5) {
                    offset = maxValue.substring(5);
                    offset = offset.replace("+", "");
                    dateTodayMS = dateTodayMS + offset * 1000;
                    dateToday.setTime(dateTodayMS);
                }
                dateToday = convertLocalTimeToUtc(dateToday);
                maxValue = getISODateTimeString(dateToday);
            }
        }
        var valParts = val.split("T");
        var minValParts;
        var maxValParts;
        if (valParts[0]) {//validate date portion
            var minValueForDate = minValue;
            var maxValueForDate = maxValue;

            if (minValue) {
                minValParts = minValue.split("T");
                if (minValParts[0]) {
                    minValueForDate = minValParts[0];   
                }
            }
            if (maxValue) {
                maxValParts = maxValue.split("T");
                if (maxValParts[0]) {
                    maxValueForDate = maxValParts[0];   
                }
            }
            rc = validateDate(valParts[0], required, minValueForDate, maxValueForDate, userSuppliedMsg, helpElement);
            if (rc === false) {
                if (logLevel >= 4) { logToWorkflow("exiting validateDateTime()", "DEBUG", false); }
                return rc;
            }
        }
        if (valParts[1]) { //validate time portion
            var minValueForTime = minValue;
            var maxValueForTime = maxValue;
            if (minValue) {
                minValParts = minValue.split("T");
                if (minValParts[1]) {
                    minValueForTime = minValParts[1];   
                }
            }
            if (maxValue) {
                maxValParts = maxValue.split("T");
                if (maxValParts[1]) {
                    maxValueForTime = maxValParts[1];   
                }
            }
            rc = validateTime(valParts[1], required, minValueForTime, maxValueForTime, userSuppliedMsg, helpElement);
            if (rc === false) {
                if (logLevel >= 4) { logToWorkflow("exiting validateDateTime()", "DEBUG", false); }
                return rc;
            }
        }
    }
    setValidationText(helpElement, helpMessage);
    if (logLevel >= 4) { logToWorkflow("exiting validateDateTime()", "DEBUG", false); }
    return rc;
}


/**
 * Determines whether or not the specified value is a valid time.
 * @param val The specified value
 * @param required True if the value must be specified, false otherwise. Optional.
 * @param minValue The minimum allowable value. Optional.
 * @param maxValue The maximum allowable value. Optional.
 * @param userSuppliedMsg The message to use if it does not match. Optional.
 * @param helpElement The help element. Optional.
 * @returns True if it is valid, false if it is not.
 */
function validateTime(val, required, minValue, maxValue, userSuppliedMsg, helpElement) {
    if (logLevel >= 4) { logToWorkflow("entering validateTime()", "DEBUG", false); }
    var helpMessage = "";
    var rc = true;
    if (rc && required && (val.length === 0)) {
        rc = false;
        helpMessage = userSuppliedMsg ? userSuppliedMsg : "this value is required";
    }
    if (rc) {
        if (!(/^((0\d)|(1\d)|(2[0-3]))(\:([0-5]\d))?(\:([0-5]\d))?(\.(\d\d\d))?$/.test(val))) {
            rc = false;
            helpMessage = userSuppliedMsg ? userSuppliedMsg : "the time is invalid";
        }   
    }
    var dtStart;
    var dtEnd;
    var difference_in_milliseconds;
    if (rc && minValue) {
        dtStart = new Date("09/26/1972 " + minValue);
        dtEnd = new Date("09/26/1972 " + val);
        difference_in_milliseconds = dtEnd - dtStart;
        if (difference_in_milliseconds < 0) {
            helpMessage = userSuppliedMsg ? userSuppliedMsg : "Time must be greater than or equal to"  + minValue;
            rc = false;
        }
    }
    if (rc && maxValue) {
        dtStart = new Date("09/26/1972 " + maxValue);
        dtEnd = new Date("09/26/1972 " + val);
        difference_in_milliseconds = dtEnd - dtStart;
        if (difference_in_milliseconds > 0) {
            helpMessage = userSuppliedMsg ? userSuppliedMsg : "Time must be less than or equal to " + maxValue;
            rc = false;
        }
    }
    setValidationText(helpElement, helpMessage);
    if (logLevel >= 4) { logToWorkflow("exiting validateTime()", "DEBUG", false); }
    return rc;
}
/**
 * Determines whether or not the specified value is a valid number.
 * @param val The specified value
 * @param required True if the value must be specified, false otherwise. Optional.
 * @param minValue The minimum allowable value. Optional.
 * @param maxValue The maximum allowable value. Optional.
 * @param numOfDecimals The maximum allowable number of digits after the decimal place. Optional.
 * @param maxLength The maximum number of characters. Optional.
 * @param userSuppliedMsg The message to use if it does not match. Optional.
 * @param helpElement The help element. Optional.
 * @returns True if it is valid, false if it is not.
 */
function validateNumber(val, required, minValue, maxValue, numOfDecimals, maxLength, userSuppliedMsg, helpElement) {
    if (logLevel >= 4) { logToWorkflow("entering validateNumber()", "DEBUG", false); }
    var helpMessage = "";
    var rc = true;
    if (rc && required && (val.length === 0)) {
        rc = false;
        helpMessage = userSuppliedMsg ? userSuppliedMsg : "this value is required";
    }
    if (val.length > 0) { //validate that we have a number
        var n = new Number(val);
        if (isNaN(val)) {
            helpMessage = userSuppliedMsg ? userSuppliedMsg : "invalid number";
            rc = false;
        }
        if (rc && minValue) { 
            if (n < minValue) {
               rc = false;
               helpMessage = userSuppliedMsg ? userSuppliedMsg : "must be greater than or equal to " + minValue;
            }
        }
        if (rc && maxValue) {  
            if (n  > maxValue) {
                rc = false;
                helpMessage = userSuppliedMsg ? userSuppliedMsg : "must be less than or equal to " + maxValue;
            }
        }
        if (rc && numOfDecimals) {
            var num = trimSpaces(val, true);
            var idxOfDecimal = num.indexOf(".");
            //lets say we get 3.1456, to calc the number of decimals we take the length - idx + 1
            if (idxOfDecimal !== -1) {
                if ((num.length - idxOfDecimal - 1) > numOfDecimals) {
                    rc = false;
                    helpMessage = userSuppliedMsg ? userSuppliedMsg : "number of decimals must be " + numOfDecimals + " or less";
                }
            }
        }
    }// if length > 0
    var lengthOfVal = val.indexOf('.') == -1 ? val.length : val.length - 1;
    if (maxLength && rc && lengthOfVal > maxLength) {
        rc = false;
        helpMessage = userSuppliedMsg ? userSuppliedMsg : "Length must be less than or equal to " + maxLength;
    }
    setValidationText(helpElement, helpMessage);
    if (logLevel >= 4) { logToWorkflow("exiting validateNumber()", "DEBUG", false); }
    return rc;
}

/**
 * Determines whether or not the specified value is a valid email.
 * @param val The specified value
 * @param helpElement The help element. Optional.
 * @returns True if it is valid, false if it is not.
 */
function validateEmail(val, helpElement) {
    if (logLevel >= 4) { logToWorkflow("entering validateEmail()", "DEBUG", false); }
    var helpMessage = "";
    var rc = true;
    if (val.length > 0)
    {
        if (!(/^[\w\.-_\+]+@[\w-]+(\.\w{2,3})+$/.test(val))) {
            helpMessage = "Invalid email";
            rc = false;
        }
    }
    setValidationText(helpElement, helpMessage);
    if (logLevel >= 4) { logToWorkflow("exiting validateEmail()", "DEBUG", false); }
    return rc;
}


/**
 * Determines whether or not the specified value is valid text.
 * @param val The specified value
 * @param required True if the value must be specified, false otherwise. Optional.
 * @param maxLength The maximum number of characters. Optional.
 * @param userSuppliedMsg The message to use if it does not match. Optional.
 * @param helpElement The help element. Optional.
 * @returns True if it is valid, false if it is not.
 */
function validateText(val, required, maxLength, userSuppliedMsg, helpElement) { //todo verify the userSupplied message applies to length
    if (logLevel >= 4) { logToWorkflow("entering validateText()", "DEBUG", false); }
    var helpMessage = "";
    var rc = true;
    if (required && (val.length === 0)) {
        rc = false;
        helpMessage = userSuppliedMsg ? userSuppliedMsg : "this value is required";
    }
    if (maxLength && rc && val.length > maxLength) {
        rc = false;
        helpMessage = userSuppliedMsg ? userSuppliedMsg : "Length must be less than or equal to " + maxLength;
    }
    setValidationText(helpElement, helpMessage);
    if (logLevel >= 4) { logToWorkflow("exiting validateText()", "DEBUG", false); }
    return rc;
}
 

/**
 * Validates the specified control.
 * @param screenKey The screen the control is on
 * @param controlKey The control's key
 * @param control The HTML element for the control
 * @returns True if it is valid, false if it is not.
 */
function validateControl(screenKey, controlKey, control) {
    if (logLevel >= 4) { logToWorkflow("entering validateControl()", "DEBUG", false); }
    var rc = true;
    var form =  document.forms[screenKey + "Form"];
    var showAlert = parseBoolean(getAttribute(form, "sup_show_alert_on_validation_error"));
    var cType = getAttribute(control, "sup_html_type");
    var userSuppliedMsg = getAttribute(control, "sup_valid_msg");
    var maxLength = getAttribute(control, "sup_max_length");
    var minValue = getAttribute(control, "sup_min_value");
    var maxValue = getAttribute(control, "sup_max_value");
    var numOfDecimals = getAttribute(control, "sup_num_of_decimals");
    var required = getAttribute(control, "sup_required_field");
    var rExp = getAttribute(control, "sup_reg_exp");
    var helpElem = document.getElementById(screenKey + "_" + controlKey + "_help");
    if (rExp) {
        rc = validateRegularExpression(control.value, rExp, userSuppliedMsg, helpElem);
    }
    if (rc) {
        if (cType === "text") {
            rc = validateText(control.value, required, maxLength, userSuppliedMsg, helpElem);
        }
        else if (cType === "number") {
            rc = validateNumber(control.value, required, minValue, maxValue, numOfDecimals, maxLength, userSuppliedMsg, helpElem);
        }
        else if (cType === "date") {
            if(isLocaleDatetimeFormat(control)&& !isIOS5()) {
                rc = validateDate(control.ISODateTimeValue, required, minValue, maxValue, userSuppliedMsg, helpElem);
            }
            else {
                rc = validateDate(control.value, required, minValue, maxValue, userSuppliedMsg, helpElem);
            }
        }
        else if (cType === "datetime-local") {
            if(isLocaleDatetimeFormat(control)&& !isIOS5()) {
                rc = validateDateTime(control.ISODateTimeValue, required, minValue, maxValue, userSuppliedMsg, helpElem);
            }
            else {
                rc = validateDateTime(control.value, required, minValue, maxValue, userSuppliedMsg, helpElem);
            }
        }
        else if (cType === "range") {
            rc = validateNumber(control.value, required, control.getAttribute("min"), control.getAttribute("max"), null, null, userSuppliedMsg, helpElem); 
        }
        else if (cType === "time") {
            if(isLocaleDatetimeFormat(control)&& !isIOS5()) {
                rc = validateTime(control.ISODateTimeValue, required, minValue, maxValue, userSuppliedMsg, helpElem);
            }
            else {
                rc = validateTime(control.value, required, minValue, maxValue, userSuppliedMsg, helpElem);
            }
        }
    }
    if (!rc && userSuppliedMsg && showAlert) {
        showAlertDialog(userSuppliedMsg);
    }
    if (logLevel >= 4) { logToWorkflow("exiting validateControl()", "DEBUG", false); }
    return rc;
}
/**
 * Validates the specified screen.
 * @param screenName The specified screen
 * @param values The current message value collection
 * @returns True if it is valid, false if it is not.
 */
function validateScreen(screenName, values, keysToValidate) {
    if (logLevel >= 4) { logToWorkflow("entering validateScreen()", "DEBUG", false); }
    if (!document.forms[screenName+"Form"]) {
        if (logLevel >= 4) { logToWorkflow("exiting validateScreen()", "DEBUG", false); }
        return true;
    }
    if (!customValidateScreen(screenName, values)) {
        if (logLevel >= 4) { logToWorkflow("exiting validateScreen()", "DEBUG", false); }
        return false;
    }
    var rc = true;
    var formElArray = document.forms[screenName+"Form"].elements;
    var i;
    for (i = 0; i < formElArray.length; i++) {
        var typeAttrib = getAttribute(formElArray[i], "sup_html_type");
        if (keysToValidate && !contains(keysToValidate, formElArray[i].id)) {
            continue;
        }
        if (formElArray[i].id && ((typeAttrib === "text") || (typeAttrib === "number") || (typeAttrib === "date") || (typeAttrib === "datetime-local") || (typeAttrib === "time") || (typeAttrib === "checkbox") || (typeAttrib === "range"))) {
            if (!validateControl(screenName, formElArray[i].id, formElArray[i])) {
                rc = false;
            }
        }        
    }
    if (logLevel >= 4) { logToWorkflow("exiting validateScreen()", "DEBUG", false); }
    return rc;
}


/**
 * Validates all open screens.
 * @returns True if it is valid, false if it is not.
 */
function validateAllScreens() {
    if (logLevel >= 4) { logToWorkflow("entering validateAllScreens()", "DEBUG", false); }
    var screenStack = [], listKeyStack = [];
    var values;
    var passed = true;
    passed = passed & validateScreen(getCurrentScreen(), getCurrentMessageValueCollection());
    if (!passed) {
        if (logLevel >= 4) { logToWorkflow("exiting validateAllScreens()", "DEBUG", false); }
        return false;
    }
    var i;
    for (i = 0; i < previousScreenName.length; i++) {
        screenStack[i] = previousScreenName[i];
        listKeyStack[i] = listViewValuesKey[i];
    }
    while(screenStack.length > 0) {
        values = workflowMessage.getValues();
        var j;
        for (j = 0; j < listKeyStack.length; j++) {
            if (listKeyStack[j]) {
                values = narrowTo(values, listKeyStack[j]);
            }
        }        
        passed = passed && validateScreen(screenStack[screenStack.length - 1], values);
        screenStack.pop();
        listKeyStack.pop();
        if (!passed) {
            break;
        }
    }    
    if (!passed) {
        var popCount = previousScreenName.length - screenStack.length;
        for(i = 0; i < popCount; i++) {
            navigateBack(false);
        }
    }
    if (logLevel >= 4) { logToWorkflow("exiting validateAllScreens()", "DEBUG", false); }
    return passed;
}


/**
* Finds an object in a given array
* @param array The array to be searched
* @param obj The object to be located within the array
* @returns True if it is found, false if it is not.
*/
function contains(array, obj) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == obj) {
            return true;
        }
    }
    return false;
}

/**
 * Opens up a wait dialog with optional wait message and cancel message
 * @param waitmsg The optional wait message to be displayed
 * @param cancelmsg The optional cancel message to be displayed
 * @param dialogid The optional dialog id prefix to be supplied
 */
function openWaitDialog(waitmsg, cancelmsg, dialogid)
{
    var dlgid = dialogid || "wait";
    var wait = waitmsg || "Please wait...";
    var cancel = cancelmsg || "Cancel";
    try {
        // create a background layer
        var width;
        var height;
        var layer = document.createElement('div');
        if (document.documentElement && document.documentElement.clientHeight) {
            width = document.documentElement.offsetWidth + document.documentElement.scrollLeft;
            height = document.documentElement.offsetHeight + document.documentElement.scrollHeight;
        } else if (document.body) {
            width = document.body.clientWidth;
            height = document.body.clientHeight;
        }
        if(!width) width = 1000;
        if(!height) height = 1000;
        layer.id = dlgid + ".background";
        layer.className = "wait_background";
        layer.style.height = height + 'px';
        layer.style.width = width + 'px';
        document.body.appendChild(layer);
        document.body.style.overflow="hidden";

        // create the dialog
        var div = document.createElement('div');
        div.id = dlgid + ".dialog";
        div.className = "wait_dialog";
        var boxheight = '80';
        var boxwidth = '200';
        var scrheight = window.innerHeight || screen.height;
        var scrwidth = window.innerWidth || screen.width;
        var boxtop = parseInt(scrheight) / 2 - boxheight / 2;
        var boxleft = parseInt(scrwidth) / 2 - boxwidth / 2;
        div.style.top = boxtop + 'px';
        div.style.left = boxleft + 'px';
        div.style.height = boxheight + 'px';
        div.style.width = boxwidth + 'px';

        // create dialog content
        var p = document.createElement('p');
        p.className = "wait_dialog";
        p.innerHTML = wait;
        div.appendChild(p);
        var a = document.createElement('a');
        a.innerHTML = cancel;
        a.href = 'javascript:void(0)';
        a.onclick = function() {
            closeWaitDialog(dlgid);
        };
        div.appendChild(a);
        document.body.appendChild(div);
    } catch(ex) {
        //alert(wait);
    }
}

/**
 * Close the wait dialog
 * @param dialogid The optional dialog id prefix to be supplied, we'll close the wait dialog whose id is dialogid + ".dialog"
 */
function closeWaitDialog(dialogid) {
    var dlgid = dialogid || "wait";
    var background = document.getElementById(dlgid + ".background");
    if (background) {
        document.body.removeChild(background);
    }
    var box = document.getElementById(dlgid + ".dialog")
    if (box) {
        document.body.removeChild(box);
    }
    document.body.style.overflow="auto";
}

/**
 * Determine whether a wait dialog is shown already 
 * @param dialogid The Optional dialog id prefix to be supplied
 */
 function isWaitDialogShown(dialogid) {
    var dlgid = dialogid || "wait";
    var background = document.getElementById(dlgid + ".background");
    if (background) {
        return true;
    } else {
        return false;
    }
 }

/**
 * Creates an HTMLValueChanged listener
 * @param context User-supplied context to be associated with the listener
 * @param html The HTML element the listener is to be associated with
 * @param callback The callback to be invoked when the value is changed
 * @returns The listener
 */
function createHTMLValueChangedListener(context, html, callback) {
    return {
        context: context,
        htmlElement: html,
        callback: callback
    };
}

/**
 * Fires a notification to any and all listeners that an HTML element's value has been changed
 * @param htmlElement The HTML element whose value has been changed
 * @param oldValue The old value
 * @param newValue The new value
 */
function fireHTMLValueChanged(htmlElement, oldValue, newValue) {
    if (oldValue === newValue) {
        return;
    }
    var found = false;
    var listener;
    var i;
    for (i = 0; i < HTMLValueChangedListeners.length; i++) {
        listener = HTMLValueChangedListeners[i];
        if (listener.htmlElement === htmlElement) {
            listener.callback.call(listener.context, newValue);
        }
    }
}

/**
 * Registers an HTMLValueChanged listener
 * @param listener The listener
 */
function addHTMLValueChangedListener(listener) {
    if(!listener) { return; }
    var found = false;
    var i;
    for (i = 0; i < HTMLValueChangedListeners.length; i++) {
        if (listener === HTMLValueChangedListeners[i]) {
            found = true;
            break;
        }
    }
    if (!found) {
        HTMLValueChangedListeners.push(listener);
    }
}

/**
 * Unregisters an HTMLValueChanged listener
 * @param listener The listener
 */
function removeHTMLValueChangedListener(listener) {
    if(!listener) { return; }
    var found = false;
    var i;
    for (i = 0; i < HTMLValueChangedListeners.length; i++) {
        if (listener === HTMLValueChangedListeners[i]) {
            found = true;
            break;
        }
    }
    if (found) {
        HTMLValueChangedListeners.splice(i, 1);
    }
}

HTMLValueChangedListeners = [];

function getScreenSpace(  pageId ,includePaddings ){
	if (isJQueryMobileLookAndFeel){
		var pageElement  =  document.getElementById( pageId );
		var contentNodes = $('div[data-role="content"]', pageElement);

		if ( contentNodes.length > 0 ) {
			var contentPage = contentNodes.get(0);
			var wrapper  = contentPage.children[0].parentNode;
			
			var paddingH =parseInt( $( wrapper).css("padding-top").replace("px", "") )+parseInt( $( wrapper).css("padding-bottom").replace("px", "") ) ;
			var paddingW =parseInt( $( wrapper).css("padding-right").replace("px", "") )+parseInt( $( wrapper).css("padding-left").replace("px", "") ) ;
			if ( includePaddings ) {
				paddingH= 0;
				paddingW = 0;
			}
			return { width: parseInt(wrapper.clientWidth - paddingW ), height: parseInt(wrapper.clientHeight - paddingH)};
		}
	}
	return  { width: screen.width, height:screen.height }
} 

/****************** INITIALIZATION ************************/
function loadPhoneGap() {
    var jsfile = null;
    var pre = "";
    var language = getURLParam("lang");
    if (!(language === undefined) && (language.length > 0)) {
        pre = "../";
    }
    
    if (isAndroid()) {
    	jsfile = pre + "js/android/phonegap-1.4.1.javascript";
    }
    if (isIOS()) {
    	jsfile = pre + "js/ios/phonegap-1.4.1.javascript";
    }
    
    if (jsfile) {
    	var req = null;
    	if (window.XMLHttpRequest) {
    		req = new XMLHttpRequest();
    	}
    	else {// code for IE6, IE5
    		req = new ActiveXObject("Microsoft.XMLHTTP");
    	}
    	req.open("GET", jsfile, false);
    	req.send(null);
    	
    	// Need to call eval with the global context
    	window[ "eval" ].call( window, req.responseText );
    }
}

loadPhoneGap();