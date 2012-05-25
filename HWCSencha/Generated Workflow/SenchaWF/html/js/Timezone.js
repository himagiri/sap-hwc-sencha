/*
 * Sybase Mobile Workflow version 2.1.3
 * 
 * Timezone.js
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 * 
 * Copyright (c) 2011 Sybase Inc. All rights reserved.
 */

/****************** TIMEZONE API FUNCTIONS ************************/

// The platforms locale string should be available.  However if it is missing the function 
// queries available JavaScript APIs for a suitable value.
function getCurrentLocale() {
    if( lang === "" ) {
        if ( navigator ) {
            if ( navigator.language ) {
            	if (isAndroid()) {
            		return navigator.userAgent.match(/Android \d+(?:\.\d+){1,2}; [a-z]{2}-[a-z]{2}/).toString().match(/[a-z]{2}-[a-z]{2}/).toString();
            	}
            	else {
                	return navigator.language;
                }    
            }
            else if ( navigator.browserLanguage ) {
                return navigator.browserLanguage;
            }
            else if ( navigator.systemLanguage ) {
                return navigator.systemLanguage;
            }
            else if ( navigator.userLanguage ) {
                return navigator.userLanguage;
            }
        }
    }
    else {
        return lang;
    }
}

// Function's input parameter is expected to be a JavaScript Date object, initialized to some valid time.
// Given this date object, the function queries the platform OS for a locale formatted DateTime string
function getLocalizedDateTime( date ) {
    if (logLevel >= 4) { logToWorkflow("entering getLocalizedDateTime", "DEBUG", false); }
    if (isAndroid()) {
        var dMilliseconds = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() );
        var sTzId = _WorkflowContainer.getLocalizedDateTime( dMilliseconds )+ ''; 
        return sTzId;  
    }
    else if (isWindowsMobile()) {     
        // Feature was not needed on this platform
        return undefined;
    }
    else if (isIOS()) {
        var dMilliseconds = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() );
        var xmlHttpReq = getXMLHTTPRequest();
        xmlHttpReq.open("GET", "/sup.amp?querytype=tz&version=2.1.3&command=tzdatetime&time=" + dMilliseconds, false);
        xmlHttpReq.send("");
        return (xmlHttpReq.responseText);
    }
    else if (isBlackBerry()) {
        var dMilliseconds = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() );
        var sTzId = WorkflowTimeZone.tzdatetime( dMilliseconds );
        return sTzId; 
    }
    else {
        return undefined;
    }
    if (logLevel >= 4) { logToWorkflow("exiting getLocalizedDateTime", "DEBUG", false); }
}

// Function's input parameter is expected to be a JavaScript Date object, initialized to some valid time.
// Given this date object, the function queries the platform OS for a locale formatted Date string
function getLocalizedDate( date ) {
    if (logLevel >= 4) { logToWorkflow("entering getLocalizedDate", "DEBUG", false); }
    if (isAndroid()) {
        var dMilliseconds = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0 );
        var sTzId = _WorkflowContainer.getLocalizedDate( dMilliseconds ) + '';  
        return sTzId;  
    }
    else if (isWindowsMobile()) {     
        // Feature was not needed on this platform
        return undefined;
    }
    else if (isIOS()) {
        var dMilliseconds = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0 );
        var xmlHttpReq = getXMLHTTPRequest();
        xmlHttpReq.open("GET", "/sup.amp?querytype=tz&version=2.1.3&command=tzdate&time=" + dMilliseconds, false);
        xmlHttpReq.send("");
        return (xmlHttpReq.responseText);
    }
    else if (isBlackBerry()){
        var dMilliseconds = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0 );
        var sTzId = WorkflowTimeZone.tzdate( dMilliseconds );
        return sTzId; 
    }
    else {
        return undefined;
    }
    if (logLevel >= 4) { logToWorkflow("exiting getLocalizedDate", "DEBUG", false); }
}

// Function's input parameter is expected to be a JavaScript Date object, initialized to some valid time.
// Given this date object, the function queries the platform OS for a locale formatted Date string
function getLocalizedTime( date ) {
    if (logLevel >= 4) { logToWorkflow("entering getLocalizedTime", "DEBUG", false); }
    if (isAndroid()) {
        var dMilliseconds = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() );
        var sTzId = _WorkflowContainer.getLocalizedTime( dMilliseconds ) + '';  
        return sTzId;  
    }
    else if (isWindowsMobile()) {     
        // Feature was not needed on this platform
        return undefined;
    }
    else if (isIOS()) {
        var dMilliseconds = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() );
        var xmlHttpReq = getXMLHTTPRequest();
        xmlHttpReq.open("GET", "/sup.amp?querytype=tz&version=2.1.3&command=tztime&time=" + dMilliseconds, false);
        xmlHttpReq.send("");
        return (xmlHttpReq.responseText);
    }
    else if (isBlackBerry()){
        var dMilliseconds = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() );
        var sTzId = WorkflowTimeZone.tztime( dMilliseconds );
        return sTzId; 
    }
    else {
        return undefined;
    }
    if (logLevel >= 4) { logToWorkflow("exiting getLocalizedTime", "DEBUG", false); }
}

// Function's input parameter is expected to be a JavaScript Date object, initialized to some valid UTC time.
// Given this date object, the function converts the value to the device's local time and 
// returns a JavaScript Date object.
function convertUtcToLocalTime( date )
{
    var iMilliseconds = date.valueOf();
    var totalOffsetInMinutes = getOffsetFromUTC( date );
    totalOffsetInMinutes = totalOffsetInMinutes * 60000;
    var time = iMilliseconds + totalOffsetInMinutes;
    var localDate = new Date();
    localDate.setTime( time );
    return localDate;
}


// Function's input parameter is expected to be a JavaScript Date object, initialized to some valid local time.
// Given this date object, the function converts the value to UTC time and returns a JavaScript Date object.
function convertLocalTimeToUtc( date )
{
    var iMilliseconds = date.valueOf();
    var totalOffsetInMinutes = getOffsetFromUTC( date );
    totalOffsetInMinutes = totalOffsetInMinutes * 60000;
    var time = iMilliseconds - totalOffsetInMinutes;
    var utcDate = new Date();
    utcDate.setTime( time );
    return utcDate;
}

// Function's input parameter is expected to be a JavaScript Date object, initialized to some valid time.
// Given this date object, the function queries the platform OS to determine the total offset (difference)
// between the given "local" time and UTC including any daylight savings offsets if applicable.
// The function returns a signed integer representing this GMT offset in minutes.
// Example, if the device was in London timezone (Gmt +1) and it is currently practicing DST, the function would return "120"
// 60 minutes normal offset plus 60 minutes for its daylight savings offset. 
function getOffsetFromUTC( date )
{
    if (logLevel >= 4) { logToWorkflow("entering getOffsetFromUTC", "DEBUG", false); }
    if (isAndroid()) {
        var lMilliseconds = date.getTime();
        var iMinutesOffset = _WorkflowContainer.getOffsetFromUTC(lMilliseconds);  
        return iMinutesOffset;  
    }
    else if (isWindows()) {
		var dt = new Date();
		var iMinutesOffset = dt.getTimezoneOffset() * (-1);
		return iMinutesOffset;
    }
    else if (isWindowsMobile()) 
    {
        // JavaScript's Date and WM's DateTime objects differs in their base starting time
        // and definition.  It was necessary to pass a "time" to the OS - see below comment
        var xmlhttp = getXMLHTTPRequest();
        var lMilliseconds = date.getTime();
        var iMinutesOffset;
        // Rather than pass a date string (which might be in a different locale format)
        // the raw parameters of the particular "date" are sent
        // this also avoids a date string parse on the OS side.
        var response;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        var request = "utcoffset=utcoffset&";
        request += "year=";
        request += year.toString();
        request += "&";
        request += "month=";
        request += month.toString();
        request += "&";
        request += "day=";
        request += day.toString();
        request += "&";
        request += "hour=";
        request += hour.toString();
        request += "&";
        request += "minute=";
        request += minute.toString();
        request += "&";
        request += "second=";
        request += second.toString();

        xmlhttp.open("POST", "/sup.amp?querytype=tz&version=2.1.3", false );
        xmlhttp.send(request);
       
        //Win32 returns 200 for OK, WM returns 0 for OK
        if (xmlhttp.status === 200 || xmlhttp.status === 0) 
        {
            response = xmlhttp.responseText;
            // trick to convert a string (with all chars are 0 - 9) to a double
            var d = response * 1;
            iMinutesOffset = d;
        }
          
        return iMinutesOffset;
    }
    else if (isBlackBerry()){
        var dMilliseconds = date.getTime();
        var iMinutesOffset = WorkflowTimeZone.totaloffset(dMilliseconds);  
        return iMinutesOffset; 
    }
    else if (isIOS()) {
        var lMilliseconds = date.getTime();
        var xmlHttpReq = getXMLHTTPRequest();
        xmlHttpReq.open("GET", "/sup.amp?querytype=tz&version=2.1.3&command=utcoffset&time=" + lMilliseconds, false);
        xmlHttpReq.send("");
        return parseInt(xmlHttpReq.responseText);
    }
    else {
        return undefined;
    }
    if (logLevel >= 4) { logToWorkflow("exiting getOffsetFromUTC", "DEBUG", false); }
}

// Function's input parameter is expected to be a JavaScript Date object, initialized to some valid time.
// Given this date object, the function queries the platform OS to determine if daylight savings rules are
// in effect for the current timezone at the time specified in the Date object.
// If the rules are in effect for the given time true is returned
// If the rules are not in effect for the given time or if the zone doesn't practice daylight savings
// false is returned 
function isDstActiveAtGivenTime( date )
{
    if (logLevel >= 4) { logToWorkflow("entering isDstActiveAtGivenTime", "DEBUG", false); }
    if (isAndroid()) {
        var iMilliseconds = date.getTime();
        return _WorkflowContainer.isDstActiveAtGivenTime(iMilliseconds);
    }
    else if (isWindowsMobile()) 
    {
        // JavaScript's Date and WM's DateTime objects differs in their base starting time
        // and definition.  It was necessary to pass a "time" to the OS - see below comment
        var xmlhttp = getXMLHTTPRequest();
        var lMilliseconds = date.getTime();
        var iMinutesOffset;
        // Rather than pass a date string (which might be in a different locale format)
        // the raw parameters of the particular "date" are sent
        // this also avoids a date string parse on the OS side.
        var request = "indst=indst&";
        var response = undefined;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();

        request += "year=";
        request += year.toString();
        request += "&";
        request += "month=";
        request += month.toString();
        request += "&";
        request += "day=";
        request += day.toString();
        request += "&";
        request += "hour=";
        request += hour.toString();
        request += "&";
        request += "minute=";
        request += minute.toString();
        request += "&";
        request += "second=";
        request += second.toString();
         
         
        xmlhttp.open("POST", "/sup.amp?querytype=tz&version=2.1.3", false );
        xmlhttp.send(request);
       
        //Win32 returns 200 for OK, WM returns 0 for OK
        if (xmlhttp.status === 200 || xmlhttp.status === 0) 
        {
            response = xmlhttp.responseText;
        }
          
        return parseBoolean(response);
    }   
    else if (isBlackBerry()){
        var dMilliseconds = date.getTime();
        return WorkflowTimeZone.indst(dMilliseconds);
    }
    else if (isIOS()) {
        var lMilliseconds = date.getTime();
        var xmlHttpReq = getXMLHTTPRequest();
        xmlHttpReq.open("GET", "/sup.amp?querytype=tz&version=2.1.3&command=indst&time=" + lMilliseconds, false);
        xmlHttpReq.send("");
        return (parseBoolean(xmlHttpReq.responseText));
    }
    else {
        return false;
    }
    if (logLevel >= 4) { logToWorkflow("exiting isDstActiveAtGivenTime", "DEBUG", false); }
}


// Function's input parameter is expected to be a JavaScript Date object, initialized to some valid time.
// Given this date object, the function queries the platform OS to determine the daylight savings offset
// for the current timezone at the time specified in the Date object.
// The return paramater is an signed integer representing the number of minutes offset for daylight savings
// for the current timezone and at the given Date.
// If the current timezone doesn't practice daylight savings, the return is 0 (zero) 
// Example, for Mountain Standard Time, at March 31st (currently is practicing DST), the returned offset is 60 
// Example, for Mountain Standard Time, at November 31st (currently is not practicing DST), the returned offset is 0
function getDstOffsetAtGivenTimeInMinutes( date )
{
    if (logLevel >= 4) { logToWorkflow("entering getDstOffsetAtGivenTimeInMinutes", "DEBUG", false); }
    if (isAndroid()) {
        var iMilliseconds = date.getTime();
        var iMinutesOffset = _WorkflowContainer.getDstOffsetAtGivenTimeInMinutes(iMilliseconds);  
        return iMinutesOffset;  
    }
    else if (isWindowsMobile()) 
    {
        // JavaScript's Date and WM's DateTime objects differs in their base starting time
        // and definition.  It was necessary to pass a "time" to the OS - see below comment
        var xmlhttp = getXMLHTTPRequest();
        var lMilliseconds = date.getTime();
        var iMinutesOffset;
        // Rather than pass a date string (which might be in a different locale format)
        // the raw parameters of the particular "date" are sent
        // this also avoids a date string parse on the OS side.
        var request = "dstoffset=dstoffset&";
        var response;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();

        request += "year=";
        request += year.toString();
        request += "&";
        request += "month=";
        request += month.toString();
        request += "&";
        request += "day=";
        request += day.toString();
        request += "&";
        request += "hour=";
        request += hour.toString();
        request += "&";
        request += "minute=";
        request += minute.toString();
        request += "&";
        request += "second=";
        request += second.toString();
         
        xmlhttp.open("POST", "/sup.amp?querytype=tz&version=2.1.3", false );
        xmlhttp.send(request);
       
        //Win32 returns 200 for OK, WM returns 0 for OK
        if (xmlhttp.status === 200 || xmlhttp.status === 0) 
        {
            response = xmlhttp.responseText;
            // trick to convert a string (with all chars are 0 - 9) to a double
            var d = response * 1;
            iMinutesOffset = d;
        }
          
        return iMinutesOffset;
    }
    else if (isBlackBerry()){
        var dMilliseconds = date.getTime();
        var iMinutesOffset = WorkflowTimeZone.dstoffset(dMilliseconds);  
        return iMinutesOffset; 
    }
    else if (isIOS()) {
        var lMilliseconds = date.getTime();
        var xmlHttpReq = getXMLHTTPRequest();
        xmlHttpReq.open("GET", "/sup.amp?querytype=tz&version=2.1.3&command=dstoffset&time=" + lMilliseconds, false);
        xmlHttpReq.send("");
        return parseInt(xmlHttpReq.responseText);
    }
    else {
        return undefined;
    }
    if (logLevel >= 4) { logToWorkflow("exiting getDstOffsetAtGivenTimeInMinutes", "DEBUG", false); }
}
// Function returns a string of the current Timezone's standard name.
// The name will not change based on daylight savings periods.
// The native OS returns the string in the current locale where applicable.
// Currently this string is derived from using available platform OS APIs.
// The values for the same timezone will be different among platforms.
function getTimezoneId() {
    if (logLevel >= 4) { logToWorkflow("entering getTimezoneId", "DEBUG", false); }
    if (isAndroid()) {
        var sTzId = _WorkflowContainer.getTimezoneId() + ''; 
        return sTzId;  
    }
    else if (isWindowsMobile()) 
    {
        var xmlhttp = getXMLHTTPRequest();
        var request = "tzid=tzid";
        var response = undefined;
        
        xmlhttp.open("POST", "/sup.amp?querytype=tz&version=2.1.3", false );
        xmlhttp.send(request);
      
        //Win32 returns 200 for OK, WM returns 0 for OK
        if (xmlhttp.status === 200 || xmlhttp.status === 0) 
        {
            response = xmlhttp.responseText;
        }
          
        return response;
    }
    else if (isIOS()) {
        var xmlHttpReq = getXMLHTTPRequest();
        xmlHttpReq.open("GET", "/sup.amp?querytype=tz&version=2.1.3&command=tzid", false);
        xmlHttpReq.send("");
        return (xmlHttpReq.responseText);
    }
    else if (isBlackBerry()){
        var sTzId = WorkflowTimeZone.tzid();  
        return sTzId; 
    }
    else {
        return undefined;
    }
    if (logLevel >= 4) { logToWorkflow("exiting getTimezoneId", "DEBUG", false); }
}

// Function returns a boolean, true or "false" depending on if the device's 
// current timezone resides in a timezone which practices daylight savings.
// if a device's current timezone never practices daylight savings, this function returns "false"
// if a device's current timezone practices DST, but DST rules are not currently in effect, function returns "true"
function getUsesDST() {
    if (logLevel >= 4) { logToWorkflow("entering getUsesDST", "DEBUG", false); }

    if (isAndroid()) {
        return _WorkflowContainer.useDaylightTimeCurrently(); 
    }
    else if (isWindowsMobile()) 
    {
        var xmlhttp = getXMLHTTPRequest();
        var date = new Date();
        var lMilliseconds = date.getTime();
        var request = "dstaware=";
        var response = undefined;
         
        request += lMilliseconds.toString();  // left for potential future use
         
        xmlhttp.open("POST", "/sup.amp?querytype=tz&version=2.1.3", false );
        xmlhttp.send(request);
       
        //Win32 returns 200 for OK, WM returns 0 for OK
        if (xmlhttp.status === 200 || xmlhttp.status === 0) 
        {
            response = xmlhttp.responseText;
        }
        return parseBoolean(response);
    }
    else if (isIOS()) {
        var xmlHttpReq = getXMLHTTPRequest();
        xmlHttpReq.open("GET", "/sup.amp?querytype=tz&version=2.1.3&command=dstaware", false);
        xmlHttpReq.send("");
        return (parseBoolean(xmlHttpReq.responseText));
    }
    else if (isBlackBerry()){
        return WorkflowTimeZone.dstaware();
    }
    if (logLevel >= 4) { logToWorkflow("exiting getUsesDST", "DEBUG", false); }
}
