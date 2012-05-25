/*
 * Sybase Mobile Workflow version 2.1.3
 * 
 * Utils.js
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 * 
 * The template used to create this file was compiled on Fri Mar 23 21:29:10 PDT 2012
 *
 * Copyright (c) 2010,2011 Sybase Inc. All rights reserved.
 */

//globals
curScreenKey = "";
defaultScreen = null;
activationScreen = null;
credentialsScreen = null;
credentialRefresh = false;  //This is true when the credentials are invalid for an async operation
origIncomingWorkflowMessage = null;
origNoUI = null;
origLoading = null;
origScreenKey = null;
loadTransformData = null;
supUserName = "";
previousScreenName = [];
listViewValuesKey = [];
UIFrameResizeHandlers=[];
workflowMessage = "";
lang = "";
sharedStorageKey = "";
resources = null;
logLevel = 1;
disableControls = false;  //used for mark as processed option

UIUpdateHandlers = [];
UIScreenListeners = [];
hasjQueryMobile = false;
isCustomLookAndFeel = false;
isJQueryMobileLookAndFeel = false;
versionURLParam = "version=2.1.3";
SERVERINITIATEDFLAG  = "$$Server-Initiated$$";       // magic value - shared with code generator

function onWorkflowLoad() {
    if (!(typeof jQuery === "undefined") &&  !(typeof jQuery.mobile === "undefined")) {
        hasjQueryMobile = true;
        isJQueryMobileLookAndFeel = true;
    } 
    deviceSpecificUpdates();
    try {
        if (!customBeforeWorkflowLoad()) {
            return;
        }
        logLevel = getURLParam("loglevel");
        if (logLevel >= 4) { logToWorkflow("entering onWorkflowLoad()", "DEBUG", false); }
        
        if (! hasjQueryMobile ){
            hideAllDivs();
        }
        
        sharedStorageKey = getURLParam("sharedstoragekey");
        logToWorkflow("Shared Storage Key: " + sharedStorageKey, "DEBUG", false);
        
        var screenNameToShow = getURLParam("screenToShow");
        defaultScreen = getURLParam("defaultScreen");
        if (!defaultScreen) {
            defaultScreen = screenNameToShow;
        }
        activationScreen = getURLParam("activationScreen");
        credentialsScreen = getURLParam("credentialsScreen");
        credentialRefresh = parseBoolean(getURLParam("credentialRefresh"));
        supUserName = getURLParam("supusername");
        lang = getURLParam("lang");
        if (!(lang === undefined)) {
            resources = new Resources(lang);
            if (!resources.hasLocale(lang)) {
                resources = null;
            }
        }
        disableControls = parseBoolean(getURLParam("isalreadyprocessed"));
        loadTransformData = parseBoolean(getURLParam("loadtransformdata"));
        //var ignoreTransformScreen = parseBoolean(getURLParam("ignoretransformscreen")); 
        logToWorkflow("URL " + window.location.href, "DEBUG", false);
        var i;
        for (i = 0; i < document.forms.length; i++) {
            var formName = document.forms[i].id;
            if (typeof(formName) === "object") {  //works around a webkit and Windows Mobile issue where if the form contains an form element with an id="id", the form's id becomes the child element.  CR 669521
                formName =  document.forms[i].name;
            }              
            setDefaultValues(formName.substring(0, formName.length - 4), 250);
        }
        var response;
        if (loadTransformData && !credentialRefresh) { //request the workflow message
        	setCurrentScreen( SERVERINITIATEDFLAG ); // normally blank or bogus - make constant for conditional navigation lookups 
            if (isWindowsMobile() || isWindows()) {
                var xmlhttp = getXMLHTTPRequest();
                if (isWindowsMobile()) {
                    xmlhttp.open("GET", "/sup.amp?querytype=loadtransformdata&" + versionURLParam, false);
                }
                else {
                    xmlhttp.open("GET", "transform.xml", false);
                }
                xmlhttp.send("");
                if (xmlhttp.status === 200 || xmlhttp.status === 0) { //Win32 returns 200 for OK, WM returns 0 for OK
                    response = xmlhttp.responseText;
                    processWorkflowMessage(response, false, true);
                }
                else {
                    logToWorkflow("Error:  Unable to retrieve the message from the server", "ERROR", true);
                }
            }
            else if (isAndroid()) {
                var response = _WorkflowContainer.getData("http://localhost/sup.amp?querytype=loadtransformdata&" + versionURLParam) + "";
                processWorkflowMessage(response, false, true);
            }              
            else { //must be BlackBerry or iOS
                var xmlhttp = getXMLHTTPRequest();
                xmlhttp.open("GET", "http://localhost/sup.amp?querytype=loadtransformdata&" + versionURLParam, false);
                xmlhttp.send("");
                response = xmlhttp.responseText;
                processWorkflowMessage(response, false, true);
            }
        }
        else { //create an empty workflow message
            workflowMessage = new WorkflowMessage("");
            if (screenNameToShow === undefined) {
                showAlertDialog("Please specify a valid screen key via ?screentoshow=ScreenKeyName or ?loadtransformdata=true");
                return;
            }
            navigateForward(screenNameToShow, undefined, true);
        }
        
        //check if there is a user name credential
        if (supUserName) {
            var form = document.getElementById(screenNameToShow + "Form");
            if (form) {
                if (form.elements.length > 0) {
                    var i;
                    for (i = 0; i < form.elements.length; i++) {
                        var formEl = form.elements[i];
                        var credStr = getAttribute(formEl, "credential");
                        if (credStr) { // we are dealing with a username or password credential
                            if (credStr === "username") {
                                setHTMLValue(formEl, supUserName);
                            }
                        }
                    }
                }
            }
        }
    
        customAfterWorkflowLoad();
    }
    catch (excep) {
        logToWorkflow("Error: " + excep.message, "ERROR", true);
    }
    if (logLevel >= 4) { logToWorkflow("exiting onWorkflowLoad()", "DEBUG", false); }
}


function deviceSpecificUpdates() {

    if ( hasjQueryMobile ) {
        if ( isBlackBerry() ){
             $.mobile.selectmenu.prototype.options.nativeMenu = true;
             
             if ( isBlackBerry7() ) {
                  $.mobile.defaultPageTransition = 'none';
             }
	    }else{
		     $.mobile.selectmenu.prototype.options.nativeMenu = false;
	    }
	    
	    if ( isIOS5() ){
	         $.mobile.defaultPageTransition = "none";
	    }
	}
	
    if (isIOS() && !hasjQueryMobile) {
        var styleSheet = document.styleSheets[0];
        var ssRules = styleSheet.cssRules;
        var i;
        for (i = 0; i < ssRules.length; i++) {
            var selText = ssRules[i].selectorText.toLowerCase();
            if ((selText === "table.listview tr.evenrow:hover") || (selText === "table.listview tr.oddrow:hover")) {
                var hoverRule = ssRules[i];
                hoverRule.style.backgroundColor="";
                hoverRule.style.color="";
            }
        }
    }
   
    if (isBlackBerry5WithTouchScreen()) {
         var i;
         for (i = 0; i < document.forms.length; i++) {
             var j;
             var formEl = document.forms[i];
             for (j = 0; j < document.forms[i].elements.length; j++) {
                 var formEl = document.forms[i].elements[j];
                 if ((formEl.type === "date") || (formEl.type === "datetime") || (formEl.type === "datetime-local") || (formEl.type === "time")) {
                     if (formEl.readOnly === true) {
                         formEl.type = "text";  //cr 661977
                     }
                 }
             }
         }
    }
    if (isAndroid()) {
        if (hasjQueryMobile) {
            //CR 690725-1 changed defaultTransition from fade to none;
            $.mobile.defaultPageTransition = 'none';  //CR 666256 and 670006 transitions on Android particularly on the simulator are clunky, 
             
            
            addDiv("sw-frame"); //CR 670117-1 workaround for datePicker control problem loading images out of CSS in embedded browser control
            addDiv("sw-slots");
            addDiv("sw-header");
            addDiv("sw-cancel");
            addDiv("sw-done");
            setTimeout("removeDiv('sw-frame')", 150);
            setTimeout("removeDiv('sw-slots')", 150);
            setTimeout("removeDiv('sw-header')", 150);
            setTimeout("removeDiv('sw-cancel')", 150);
            setTimeout("removeDiv('sw-done')", 150);

            var div = addDiv('checkboxDiv'); //CR 672971 unable to load images from css after the page loads
            div.innerHTML = '<span class="ui-icon ui-icon-ui-icon-checkbox-off ui-icon-checkbox-on ui-icon-checkbox-off"></span>'
            setTimeout("removeDiv('checkboxDiv')", 150);
        }
        else {
            var i;
            for (i = 0; i < document.forms.length; i++) {
                var j;
                var formEl = document.forms[i];
                for (j = 0; j < document.forms[i].elements.length; j++) {
                    var formEl = document.forms[i].elements[j];
                    if (formEl.type === "range") {
                        formEl.type = "number";  //CR 664665-1
                    }
                }
            }
        }
        //CR 670127-1 readonly fields can be navigated to via the next/prev buttons
        var i;
        for (i = 0; i < document.forms.length; i++) {
            var j;
            var formEl = document.forms[i];
            for (j = 0; j < document.forms[i].elements.length; j++) {
                var formEl = document.forms[i].elements[j];
                if (formEl.readOnly === true) {
                    if (hasjQueryMobile) {  //pickers are made readonly in workflow_jQueryMobileLookAndFeel.html in document.ready 
                        if (!((formEl.type === "date") || (formEl.type === "datetime") || (formEl.type === "datetime-local") || (formEl.type === "time"))) {
                            formEl.setAttribute("disabled", "disabled");
                        }
                    }
                    else {
                        formEl.setAttribute("disabled", "disabled");
                    }
                }
            }
        }
    }
    if (isWindowsMobile()) {  //work around windows mobile bug where select elements do not respect the disabled attribute
        var i;
        for (i = 0; i < document.forms.length; i++) {
            var j;
            var formEl = document.forms[i];
            for (j = 0; j < document.forms[i].elements.length; j++) {
                var formEl = document.forms[i].elements[j];
                if (formEl.tagName === "SELECT") {
                    var attr = getAttribute(formEl, "sup_disabled");
                    if (attr === "disabled") {
                        formEl.disabled = true;
                    }
                }
            }
        }
        for (i = 0; i < document.forms.length; i++) { //CR 690645
            var form = document.forms[i];
            var links = getElementsByTagName(form, "a");
            var linkIdx;
            for (linkIdx = 0; linkIdx < links.length; linkIdx++) {
                var prefix = getAttribute(links[linkIdx], "sup_link_prefix");
                var suffix = getAttribute(links[linkIdx], "sup_link_suffix");
                var href = links[linkIdx].href; 
                if (prefix === "tel:" || (prefix === "mailto:")) {
                    if (prefix) {
                        href = href.substring(prefix.length);
                    }
                    if (suffix) {
                        href = href.substring(0, href.length - suffix.length);
                    }
                    links[linkIdx].href = "javascript:showUrlInBrowser('" + prefix + href + suffix + "')";
                }
            }
        }
    }    
}


function removeAndroidSpinner() {
    if (isAndroid() && hasjQueryMobile) {
        var ps = document.getElementById("pickerScreen"); //fix for 670609-2
        if (ps) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", true, true );
            ps.dispatchEvent(evt);
        }
    }
}

function removeBBDatePicker() {
    if (isBlackBerry() && hasjQueryMobile) {
        var ps = document.getElementById("pickerScreen"); //fix for 685005-1
        if (ps) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", true, true );
            ps.dispatchEvent(evt);
        }
    }
}

function addDiv(divID) {
    var div2 = document.createElement('div');
    div2.id = divID;
    div2.innerHTML = ' ';
    document.body.appendChild(div2);
    return div2; 
}

function removeDiv(divID) {
    var div2 = document.getElementById(divID);
    document.body.removeChild(div2);
}


function processWorkflowMessage(incomingWorkflowMessageValue, noUI, loading, fromActivationFlow) {
    if (logLevel >= 4) { logToWorkflow("entering processWorkflowMessage()", "DEBUG", false); }
    var incomingWorkflowMessage;
    if (!(typeof incomingWorkflowMessageValue === "string")) {
        incomingWorkflowMessage = incomingWorkflowMessageValue.toString() + "";
    }
    else {
        incomingWorkflowMessage = incomingWorkflowMessageValue;
    }    
    var dataSize = incomingWorkflowMessage.length;
    if (isWindowsMobile() && (incomingWorkflowMessage.length > 500000)) {
        var answer = confirm("Workflow messages larger than 500,000 bytes are unlikely to be successfully parsed on this device.  The message size is " + dataSize + ".  Do you wish to continue?");
        if (!answer) {
            return;
        }   
    }
    if ((incomingWorkflowMessage.indexOf("<XmlWidgetMessage>") === 0)
                || (incomingWorkflowMessage.indexOf("<XmlWorkflowMessage>") === 0)
                || (incomingWorkflowMessage.indexOf("<M>") === 0)) {
        if (workflowMessage) {
            var newWorkflowMessage = new WorkflowMessage(incomingWorkflowMessage);
            workflowMessage.setWorkflowScreen(newWorkflowMessage.getWorkflowScreen());
            workflowMessage.setRequestAction(newWorkflowMessage.getRequestAction());
            workflowMessage.setHeader(newWorkflowMessage.getHeader());
            workflowMessage.updateValues(newWorkflowMessage.getValues(), listViewValuesKey);
        }
        else {
            workflowMessage = new WorkflowMessage(incomingWorkflowMessage);
            var currentScreenKey = getCurrentScreen();
            if (activationScreen || credentialsScreen) { 
                //save these so we can call processWorkflowMessage after showing the activation screen
                origIncomingWorkflowMessage = incomingWorkflowMessage;
                origNoUI = noUI;
                origLoading = false;
            }
            if (activationScreen) {
                //go to the activation screen if required
                var screenToNavTo = activationScreen;
                setCurrentScreen('');
                navigateForward(screenToNavTo, undefined, loading, true);
                return;
            }
            if (credentialsScreen) { //go to the credential screen if required
                var screenToNavTo = credentialsScreen;
                setCurrentScreen('');
                navigateForward(screenToNavTo, undefined, loading);
                return;
            }
        }
        if(typeof(customAfterDataReceived)==='function') {
            customAfterDataReceived(workflowMessage);
        }
        if (!noUI)
        {
	        var workFlowScreenToOpen = workflowMessage.getWorkflowScreen();
	
	        // handle any conditional navigation
	        if(typeof(customConditionalNavigation)==='function') {
	            var currentScreenKey = getCurrentScreen();
	            var requestAction = workflowMessage.getRequestAction();
	            var customNavigations = getCustomNavigations(currentScreenKey, requestAction);
	            var customNavsLength = customNavigations.length;
	            var idx = 0;
	            
	            if( customNavsLength > 0 ) {
	                try {
	                    for( idx=0; idx<customNavsLength; idx++) {
	                        if( customConditionalNavigation( currentScreenKey, requestAction,
                                  workFlowScreenToOpen,
                                  customNavigations[idx].condition,
                                  workflowMessage)) {
	                            workFlowScreenToOpen = customNavigations[idx].screen;
	                            if (logLevel >= 4) { logToWorkflow("Conditional Navigation changed next screen", "DEBUG", false); }
	                            break;
	                        }
                        }
	                } catch( error ) {
                        // log and tell the user
                        // then bail out to execute the 'default' screen.
                        logToWorkflow("Error: " + error.message, "ERROR", true);
                        logToWorkflow("Error - customConditionalNavigation: idx=" + idx, "ERROR", false);
	                }
	            }
	        }
            if (getCurrentScreen() === SERVERINITIATEDFLAG) { // wasn't a real screen, so clean up after ourselves  //after a migration Custom.js is not updated CR 679459
                setCurrentScreen('');
                //if we previously came from an activation or credential screen we need to set the screen back to that so that we can properly navigateForward (hide the old screen)
                if (origScreenKey) {
                    setCurrentScreen(origScreenKey);
                }
            }

            // navigate to the next screen
 			if (workFlowScreenToOpen && workFlowScreenToOpen !== getCurrentScreen()) {
                navigateForward(workFlowScreenToOpen, undefined, loading, fromActivationFlow);
            }
            else {
                updateUIFromMessageValueCollection(getCurrentScreen(), getCurrentMessageValueCollection());
                if ( !(typeof iScroller === "undefined") && iScroller ) {
                	iScroller.refresh();
                }
            }
        }
    }
    else {  //it is an error message to be displayed
        showErrorFromNative(incomingWorkflowMessage); 
    }  
    if (logLevel >= 4) { logToWorkflow("exiting processWorkflowMessage()", "DEBUG", false); }
}


function hideAllDivs() {
    if (logLevel >= 4) { logToWorkflow("entering hideAllDivs()", "DEBUG", false); }
    var divs = document.getElementsByTagName('div');
    var i;
    for (i = 0; i < divs.length; i++) {
        var id =  getAttribute( divs[i], 'id');
        if (id !== null && id.lastIndexOf('ScreenDiv') > 0) { 
            divs[i].style.display = "none";
        }
    } 
    if (logLevel >= 4) { logToWorkflow("exiting hideAllDivs()", "DEBUG", false); }
}

function addNativeMenuItemsForScreen(screenToShow, subMenuName, okaction) {
    if (logLevel >= 4) { logToWorkflow("entering addNativeMenuItemsForScreen()", "DEBUG", false); }
    var divToShow = screenToShow + "ScreenDiv";
    var toShowEl = document.getElementById(divToShow);
    if (toShowEl) {
        if (isBlackBerry() || isWindowsMobile() || isAndroid()) {
            var menuToHideEl = document.getElementById(divToShow + "Menu");
            if (menuToHideEl) {
                menuToHideEl.style.display = "none";
            }
            var menuItemNamesStr = getAttribute(toShowEl, "sup_menuitems");
            var hasMenuItems = false;
            if (menuItemNamesStr) {
                var menuItemNames = menuItemNamesStr.split(',');
                var menuStr = "{\"menuitems\":[";
                var i;                                
                for (i = 0; i < menuItemNames.length; i++) {
                    var menuItemName = menuItemNames[i++];
                    var menuItemKey = menuItemNames[i];
                    var methodName = convertToValidJavaScriptName('menuItemCallback' + screenToShow + menuItemKey);
                    if (i === 1) {  //first value will be the default value
                        menuStr = menuStr + "{\"name\":\"" + menuItemName + "\",\"action\":\"" + methodName + "()\",\"default\":\"true\"},";
                    }
                    else {
                        menuStr = menuStr + "{\"name\":\"" + menuItemName + "\",\"action\":\"" + methodName + "()\"},";
                    }
                }
                if (menuStr.length > 15) {
                    hasMenuItems = true;
                    menuStr = menuStr.substring(0, menuStr.length - 1);
                    menuStr = menuStr + "],\"lang\":\"" + lang + "\",\"submenuname\":\"";
                    if (subMenuName) {
                        menuStr = menuStr + subMenuName;
                    }
                    else {
                        if (resources) {
                            menuStr = menuStr + resources.getString("MENU");
                        }
                        else {
                            menuStr = menuStr + "Menu";
                        }
                    }
                    if (isWindowsMobile()) {
                        if (!okaction) {
                            okaction = getAttribute(toShowEl, "sup_okaction");
                        }
                        if (!okaction) {
                            okaction = "doSaveAction()";
                        }
                        menuStr = menuStr + "\",\"OK\":\"" + okaction;
                    }
                    menuStr = menuStr + "\"}";
                    var request = "http://localhost/sup.amp?querytype=addallmenuitems&" + versionURLParam + "&menuitems=" + encodeURIComponent(menuStr);
                    if (isWindowsMobile()) {
                        var xmlhttp = getXMLHTTPRequest();
                        xmlhttp.open("POST", "/sup.amp?querytype=addallmenuitems&" + versionURLParam, false);
                        xmlhttp.send("menuitems=" + encodeURIComponent(menuStr));
                    }
                    else if (isAndroid()) {
                        var response = _WorkflowContainer.postData("http://localhost/sup.amp?querytype=addallmenuitems&" + versionURLParam, request);
                    }                      
                    else {
                        var xmlhttp = getXMLHTTPRequest();
                        xmlhttp.open("POST", "http://localhost/sup.amp?querytype=addallmenuitems&" + versionURLParam, true);
                        xmlhttp.send("menuitems=" + encodeURIComponent(menuStr));
                    }
                }
            }
            if (!hasMenuItems) {
                removeAllMenuItems();
            }
        }
    }
    if (logLevel >= 4) { logToWorkflow("exiting addNativeMenuItemsForScreen()", "DEBUG", false); }
}


function showScreen(screenToShow, screenToHide, isNavigateBack ) {
    if (logLevel >= 4) { logToWorkflow("entering showScreen()", "DEBUG", false); }
        if (!customBeforeShowScreen(screenToShow, screenToHide)) {
        if (logLevel >= 4) { logToWorkflow("exiting showScreen()", "DEBUG", false); }
        return;
    }
    removeAndroidSpinner();
    //  Make sure the DatePicker goes away on screen transitions
    removeBBDatePicker()

    var divToShow = screenToShow + "ScreenDiv";
    var divToHide;
    if (screenToHide) {
        divToHide = screenToHide + "ScreenDiv";
    }
    var toShowEl = document.getElementById(divToShow);
    if (toShowEl) {
        var helpElem = document.getElementById(divToShow.substring(0, divToShow.length - 9) + "Form_help");
        if (helpElem) {
            setValidationText(helpElem, ""); //to remove any messages added by onCustomNavigate
        }
        
        if (! hasjQueryMobile ){
            toShowEl.style.display = "block";
            if ( toShowEl.offsetHeight < screen.height ) {
                toShowEl.style.height = screen.height +'px';
            }
        }
    }
    else {
        showAlertDialog("Please specify a valid screen to show via ?screenToShow=ScreenKeyName");
    }
    
    if (divToHide && ( ! hasjQueryMobile )) {
        var toHideEl = document.getElementById(divToHide);
        if (toHideEl) {
            toHideEl.style.display = "none";
        }
    }
    document.title = divToShow.substring(0, divToShow.length - 9);
    var i;
    for (i = 0; i < UIScreenListeners.length; i++ ) {
        var listener = UIScreenListeners[ i];
        var obj  = {
            screenToShow : screenToShow,
            screenToHide : screenToHide,
            isNavigateBack: isNavigateBack
        };
        listener.call( this, obj );
    }
    if (!isIOS() && !isWindows()) { //give focus to an element  //has no affect on an IOS device
        var form = document.getElementById(screenToShow + "Form");
        if (form) {
            var i;
            for (i = 0; i < form.elements.length; i++) {
                var formEl = form.elements[i];
                if (formEl.focus) {
                    formEl.focus();
                    break;
                }
            }
        }
    }
   
     if ( !isJQueryMobileLookAndFeel) {
     	setCurrentScreen( screenToShow );
        customAfterShowScreen(screenToShow, screenToHide);
    }else {
    	//please binding to JQM pageshow event in jQuery $(document).ready function.  
    }

    if (logLevel >= 4) { logToWorkflow("exiting showScreen()", "DEBUG", false); }
}


function setDefaultValues(screenKey) {
    if (logLevel >= 4) { logToWorkflow("entering setDefaultValues()", "DEBUG", false); }
    //loop through the form elements of type date or datetime-local
    var form = document.getElementById(screenKey + "Form");
    if (form && (form.elements.length > 0)) {
        var valueToShow;
        var i;
        for (i = 0; i < form.elements.length; i++) {
            var formEl = form.elements[i];
            var defaultValue = getAttribute(formEl, "sup_default_value");
            var type = getAttribute(formEl, "sup_html_type");
            valueToShow = "";
            if (defaultValue) {
                if (type === "date") {
                    var someDate = getDateFromExpression(defaultValue);
                    valueToShow = getISODateString(someDate);
                }
                else if (type === "datetime-local") {
                    var idxOfToday = defaultValue.indexOf("today");
                    var idxOfNow = defaultValue.indexOf("now");
                    if (idxOfToday === 0) {
                        valueToShow = getDateTimeToday(formEl, defaultValue);
                    }
                    else if (idxOfNow === 0) {
                        valueToShow = getDateTimeNow(formEl);
                    }
                    else {
                        var aDate = new Date(parseDateTime(formEl, defaultValue));
                        valueToShow = getISODateTimeString(aDate, getAttribute(formEl, "sup_precision"));
                    }
                }
				else if(type == "time") {
					var timeStr = getTimeStringToDisplayFromStr(defaultValue, getAttribute(formEl, "sup_precision"));
					var aTime = new Date(parseTime(timeStr));
					valueToShow = getISOTimeString(aTime, getAttribute(formEl, "sup_precision"));
				}
                if (valueToShow) {
                    setHTMLValue(formEl, valueToShow, screenKey, false);
                }
                else {
                    if (formEl.value != defaultValue) {
                        setHTMLValue(formEl, defaultValue, screenKey, false);
                    }
                }
            }
            else { //if we do not have a defaultValue and the type is date, datetime, time, number, or slider set a default value
                if (type === "date") {
                    var dateNow = new Date();
                    valueToShow = getISODateString(dateNow);
                }
                else if (type === "datetime-local") {
                    var dateNow = new Date();
                    valueToShow = getISODateTimeString(dateNow, getAttribute(formEl, "sup_precision"));
                }
                else if (type === "time") {
                    var dateNow = new Date();
                    valueToShow = getISOTimeString(dateNow, getAttribute(formEl, "sup_precision"));
                }
                else if (type === "number") {
                    var minValue = getAttribute(formEl, "sup_min_value");
                    var maxValue = getAttribute(formEl, "sup_max_value");
                    if (minValue && maxValue) {
                        if (0 >= minValue && (0 <= maxValue)) {
                            valueToShow = 0;
                        }
                        else {
                            valueToShow = minValue;
                        }
                    }
                    else if (minValue) {
                        if (0 >= minValue) {
                            valueToShow = 0;
                        }
                        else {
                            valueToShow = minValue;
                        }
                    }
                    else if (maxValue) {
                        if (0 <= maxValue) {
                            valueToShow = 0;
                        }
                        else {
                            valueToShow = maxValue;
                        }
                    }
                    else {
                        valueToShow = 0;
                    }
                }
                else if (type === "range") {
                    var minValue = getAttribute(formEl, "min");
                    if (minValue) {
                       valueToShow = minValue;
                    }
                    else {
                        valueToShow = 0;
                    }
                }
                else if (type === "text") {
                    valueToShow = "";
                }
                if (!(valueToShow === null) && !(valueToShow === undefined)) {
                    setHTMLValue(formEl, valueToShow, screenKey, false);
                }
            }
        } //elements in a form
    }
    if (logLevel >= 4) { logToWorkflow("exiting setDefaultValues()", "DEBUG", false); }
}


function getTimeZoneOffset(aDate) {
    var offset = aDate.getTimezoneOffset();
    if (offset === 0) {
        if (isBlackBerry()) {
            var offset = -1 * getOffsetFromUTC(aDate); //(-1  674539-1 negative rather than positive
        }
    }
    return offset; 
}


function getDateTimeToday(formEl, defaultValue) {
    var dateNow = new Date();
    dateNow.setHours(12);
    dateNow.setMinutes(0);
    dateNow.setSeconds(0);
    dateNow.setMilliseconds(0);
    if (defaultValue.length > 5) {
        var offset = defaultValue.substring(5);
        offset = offset.replace("+", "");
        var dateNowMS = dateNow.getTime();
        dateNowMS = dateNowMS + offset * 1000;
        dateNow.setTime(dateNowMS);
    }
    var prec = "";
    if (formEl) {
        prec = getAttribute(formEl, "sup_precision");
    }
    defaultValue = getISODateTimeString(dateNow, prec);
    return defaultValue;
}

function getDateTimeNow(formEl) {
    var dateNow = new Date();
    return getISODateTimeString(dateNow, getAttribute(formEl, "sup_precision"));
}


function addZero(value) {
    value = value + "";
    var ret = (value.length === 1) ? "0" + value : value;
    return ret;
}


function addListViewHeader(linesStr) {
    var lines = linesStr.split("&?")[4].split("&;");
    var hdrHTML = "<thead>";
    var linesIdx;
    for (linesIdx = 0; linesIdx < lines.length; linesIdx++) {
        hdrHTML = hdrHTML + "<tr>";
        var lineDetails = lines[linesIdx];
        var fields = lineDetails.split("&,");
        var fieldIdx;
        for (fieldIdx = 0; fieldIdx < fields.length; fieldIdx = fieldIdx + 7) {
            var fieldHeaderTitle = fields[fieldIdx + 2];
            if (fieldHeaderTitle.length === 0) {
                continue;
            }
            var fieldHeaderWidth = fields[fieldIdx + 1];
            if (fieldHeaderWidth != "0") {
                hdrHTML = hdrHTML + '<th align="left" width="'+ fieldHeaderWidth + '%">' + fieldHeaderTitle + '</th>';
            }
        }
    }
    hdrHTML = hdrHTML + "</tr></thead>";
    return hdrHTML;
}


function addListViewItem(linesTxt, onClk, altRowColor, even, firstRow) {
    if (logLevel >= 4) { logToWorkflow("entering addListViewItem()", "DEBUG", false); }
    var trHTML = "";
    var i;
    for (i = 0; i < linesTxt.length; i++) {
        var fields = linesTxt[i];
        var className = "";
        var firstLine = (i === 0);
        var lastLine = (i === linesTxt.length - 1)
        if (firstRow) {
            if (firstLine && lastLine) {
                className = " class=\"firstAndLastLine\"";
            }
            else if (firstLine) {
                className = " class=\"firstLine\"";
            }
            else if (lastLine) {
                className = " class=\"lastLine\"";
            }
        }
        else if (lastLine) {
            className = " class=\"lastLine\"";
        }
        var altRow = " class=\"oddrow\"";
        var trStyle = "";
        if (even) {
            altRow = " class=\"evenrow\"";
            if (!document.styleSheets  || !document.styleSheets[0].addRule) { //Windows Mobile and BB 5 do not appear to support dynamically modifing the stylesheet
                if ((altRowColor !== "null") && (altRowColor.length > 0)) {
                    trStyle = " style=\"background: " + altRowColor + "\" ";
                }
            }
        }
        if (onClk && !isWindowsMobile()) {
            trHTML = trHTML + "<tr onclick=\"" + onClk + "\"" + altRow + trStyle + ">";
        }
        else {
            trHTML = trHTML + "<tr" + altRow + trStyle + ">";
        }
        var j;
        for (j = 0; j < fields.length; j++) {
            var field = fields[j];
            var font = field.font;
            var fontStart = "";
            var fontEnd = "";
            //if (isIOS()) {   // iphone automatically changes address, email, phone number to a link.  Adding no width space will prevent this but on some devices it appears as a square
                //field.value = '\u2060' + field.value;
            //}
            var value = field.value;
            if (font === "Bold") { 
                fontStart = "<b>";
                fontEnd = "</b>";
            }
            else if (font === "Italic") {
                fontStart = "<i>";
                fontEnd = "</i>";
            }
            else if (font === "normal") {
                fontStart = "<plain>";
                fontEnd = "</plain>";
            }
            if (field.dataType === "DATE") {
                var strIdx = field.value.indexOf("T");
                if (strIdx !== -1) {
                    field.value = field.value.substr(0, strIdx);
                }
                value = field.value;
            }
            else if (field.dataType === "TIME") {
                var strIdx = field.value.indexOf("T");
                if (strIdx !== -1) {
                    field.value = field.value.substr(strIdx+1);
                }
                value = field.value;
            } else if (field.dataType === "DATETIME") {
                var aDateTime = new Date(parseDateTime(null, field.value));
				aDateTime = convertUtcToLocalTime(aDateTime);
                field.value = getISODateTimeString(aDateTime);
                value = field.value;
            } else if ( field.dataType === "IMAGE" ) {
                if (isWindowsMobile() && field.isStaticImage === 'false' )
                    value = '';
                if (field.isStaticImage === 'true' )
                    value ='<img src="' + value +'" height="' + field.imageHeight + '"/>';
                else if (field.isStaticImage === 'false' && isWindowsMobile() === 'false' )
                    value ='<img src="data:image/jpeg;base64,' + value +'" height="' + field.imageHeight + '"/>';
            }

            if (field.width != "0") {
                if (isWindowsMobile()) {   //Windows mobile does not appear to support an onclick handler on the row ... so use an anchor
                    if (onClk) {
                        trHTML = trHTML + "<td" + className + " width='" + field.width + "%'><a href=\"javascript:" + onClk + "\">" + fontStart + value + fontEnd + "</a></td>";
                    }
                    else {
                        trHTML = trHTML + "<td" + className + " width='" + field.width + "%'>" + value + "</td>";
                    } 
                }
                else {
                    trHTML = trHTML + "<td" + className + " width='" + field.width + "%'>" + fontStart + value + fontEnd + "</td>";
                }
            }
        }
        trHTML = trHTML + "</tr>";
    }
    if (logLevel >= 4) { logToWorkflow("exiting addListViewItem()", "DEBUG", false); }
    return trHTML;
}

function delayedSetValue(screenKey, elemId, val) {
    if (logLevel >= 4) { logToWorkflow("entering delayedSetValue()", "DEBUG", false); }
    var form = document.getElementById(screenKey + "Form");
    var elem = getFormElementById(form, elemId);
    elem.value = val;
    if (logLevel >= 4) { logToWorkflow("exiting delayedSetValue()", "DEBUG", false); }
}

function delayedSliderSetValue(screenKey, elemId, val) {
     if (logLevel >= 4) { logToWorkflow("entering delayedSliderSetValue", "DEBUG", false); }
     try {
         var form = document.getElementById(screenKey + "Form");
         var slider = getFormElementById(form, elemId);
         slider.value = val;
         $(slider).slider("refresh");
     }
     catch (e) {}
}

function delayedCheckboxSetValue(screenKey, elemId, val) {
    if (logLevel >= 4) { logToWorkflow("entering delayedCheckboxSetValue", "DEBUG", false); }
    try {
        var form = document.getElementById(screenKey + "Form");
        var check = getFormElementById(form, elemId);
        check.checked = parseBoolean(val);
        $(check).checkboxradio("refresh");
    }
    catch (e) {}
}


function getCredInfo(screenToCheck) {
    if (logLevel >= 4) { logToWorkflow("entering getCredInfo()", "DEBUG", false); }
    if (!(screenToCheck)) {
        screenToCheck = getCurrentScreen();
    }
    var credInfo = "";
    if (screenToCheck) {
        var form = document.forms[screenToCheck + "Form"];
        if (form) {
            if (form.elements.length > 0) {
                var i;
                for (i = 0; i < form.elements.length; i++) {
                    var formEl = form.elements[i];
                    var credStr = getAttribute(formEl, "credential");
                    if (credStr) { // we are dealing with a username or password credential
                        if (credStr === "username") {
                            credInfo = "supusername=" + encodeURIComponent(formEl.value) + "&";
                            supUserName = formEl.value;
                        }
                        else if (credStr === "password") {
                            credInfo += "suppassword=" + encodeURIComponent(formEl.value) + "&";
                        }
                    }
                }
            }
        }
    }
    if (credInfo) {
        credInfo = credInfo + versionURLParam;
    }
    if (logLevel >= 4) { logToWorkflow("exiting getCredInfo()", "DEBUG", false); }
    return credInfo;
}

function clearCredentialPassword() {
    if (curScreenKey) {
        var form = document.forms[curScreenKey + "Form"];
        if (form) {
            if (form.elements.length > 0) {
                var i;
                for (i = 0; i < form.elements.length; i++) {
                    var formEl = form.elements[i];
                    var credStr = getAttribute(formEl, "credential");
                    if (credStr) { // we are dealing with a username or password credential
                        if (credStr === "password") {
                            formEl.value = "";
                        }
                    }
                }
            }
        }
    }
}



function handleCredentialChange(screenToCheck) {
    if (logLevel >= 4) { logToWorkflow("entering handleCredentialChange()", "DEBUG", false); }
    //need to post credentials with each navigation if any
    if (!(screenToCheck)) {
        screenToCheck = getCurrentScreen();
    }
    var credInfo = getCredInfo(screenToCheck);
    var requestData = credInfo ? credInfo : "";
    if (requestData) {   
        if (activationScreen) { 
            credentialsScreen = null; //no need to show the credentials screen if we provide the credentials on the activation screen
        }	 
        if (isWindowsMobile())  {
            var xmlhttp = getXMLHTTPRequest();
            xmlhttp.open("POST", "/sup.amp?querytype=formredirect&" + versionURLParam, false);
            xmlhttp.send(requestData);
        }
        else if (isAndroid()) {
            _WorkflowContainer.postData("http://localhost/sup.amp?querytype=formredirect&" + versionURLParam, requestData);
        }
        else if (!isWindows()) {
            var xmlhttp = getXMLHTTPRequest();
            xmlhttp.open("POST", "http://localhost/sup.amp?querytype=formredirect&" + versionURLParam, true);
            xmlhttp.send(requestData);
        }
    }
    if (logLevel >= 4) { logToWorkflow("exiting handleCredentialChange()", "DEBUG", false); }
}

function windowOpen(sUrl) {
    if (logLevel >= 4) { logToWorkflow("entering windowOpen()", "DEBUG", false); }
    window.open(sUrl);
    if (logLevel >= 4) { logToWorkflow("exiting windowOpen()", "DEBUG", false); }
}

function showErrorFromNative(errMsg) {
    if (logLevel >= 4) { logToWorkflow("entering showErrorFromNative()", "DEBUG", false); }
    reportErrorFromNative(errMsg);
    if (logLevel >= 4) { logToWorkflow("exiting showErrorFromNative()", "DEBUG", false); }
}

function reportErrorFromNative(errString) {
    if (logLevel >= 4) { logToWorkflow("entering reportErrorFromNative()", "DEBUG", false); }
    if (typeof(customBeforeReportErrorFromNative) === 'function' && !customBeforeReportErrorFromNative(errString)) {
        if (logLevel >= 4) { logToWorkflow("exiting reportErrorFromNative()", "DEBUG", false); }
        return;
    }
    var callbackMethod = getURLParamFromNativeError("onErrorCallback", errString);
    var errorCode = getURLParamFromNativeError("errCode", errString);
    var onErrorMsg;
    if( isBlackBerry() ) {
	    onErrorMsg = unescape(getURLParamFromNativeError("onErrorMsg", errString));
	} else {
    	// This is a temporary fix for a bug in the container that calls
    	// encodeURIComponent on the whole query string for Android.  See
    	// IR 676161-2.
		onErrorMsg = getURLParamFromNativeError("onErrorMsg", errString);
    }
    var nativeMsg = getURLParamFromNativeError("nativeErrMsg", errString);
    if (callbackMethod) {
        window[callbackMethod].call(this, errorCode, onErrorMsg, nativeMsg); 
    }
    else if (onErrorMsg) {
        showAlertDialog(onErrorMsg);
    }
    else if (nativeMsg) {
        showAlertDialog(nativeMsg);
    }
    if (typeof(customAfterReportErrorFromNative) === 'function') {
        customAfterReportErrorFromNative(errString);
    }
    if (logLevel >= 4) { logToWorkflow("exiting reportErrorFromNative()", "DEBUG", false); }
}


function getURLParamFromNativeError(paramName, url) {
    if (logLevel >= 4) { logToWorkflow("entering getURLParamFromNativeError()", "DEBUG", false); }
    var indxofS, idxofE;
    var pName, pValue;
    var paramSection;
    var ret;

    if( isBlackBerry() ) {
    	paramSection = url;
	} else {
    	// This is a temporary fix for a bug in the container that calls
    	// encodeURIComponent on the whole query string for Android.  See
    	// IR 676161-2.
    	paramSection = decodeURIComponent(url);
    }
    var idxofA = paramSection.indexOf("&");
    if (idxofA > 0) {//there is one or more parameters in the & section
        var paramSectionsAmp = paramSection.substring(idxofA + 1);
        var ampSections = paramSection.split("&");
        if (ampSections.length === 1) {
            idxofE = paramSectionsAmp.indexOf("=");
            pName = paramSectionsAmp.substring(0, idxofE);
            if (pName.toLowerCase() === paramName.toLowerCase()) {
                pValue = paramSectionsAmp.substring(idxofE + 1);
                ret = decodeURIComponent( pValue);
                if (logLevel >= 4) { logToWorkflow("exiting getURLParamFromNativeError()", "DEBUG", false); }
                return ret;
            }
        }
        else {  //multiple parameters in the & section
            for (indxofS in ampSections) {
                idxofE = ampSections[indxofS].indexOf("=");
                pName = ampSections[indxofS].substring(0, idxofE);
                if (pName.toLowerCase() === paramName.toLowerCase()) {
                    pValue = ampSections[indxofS].substring(idxofE + 1);
                    ret = decodeURIComponent( pValue) ;
                    if (logLevel >= 4) { logToWorkflow("exiting getURLParamFromNativeError()", "DEBUG", false); }
                    return ret;
                }
            }
        }
        //ok did not find paramName in & section look for it at the start
        idxofE = paramSection.indexOf("=");
        pName = paramSection.substring(0, idxofE);
        if (pName.toLowerCase() === paramName.toLowerCase()) {
            pValue = paramSection.substring(idxofE + 1, idxofA);
            ret = decodeURIComponent( pValue );
            if (logLevel >= 4) { logToWorkflow("exiting getURLParamFromNativeError()", "DEBUG", false); }
            return ret;
        }
    }
    else { //only one param
        idxofE = paramSection.indexOf("=");
        pName = paramSection.substring(0, idxofE);
        if (pName.toLowerCase() === paramName.toLowerCase()) {
            pValue = paramSection.substring(idxofE + 1);
            ret = decodeURIComponent( pValue );
            if (logLevel >= 4) { logToWorkflow("exiting getURLParamFromNativeError()", "DEBUG", false); }
            return ret;
        }
    }
    if (logLevel >= 4) { logToWorkflow("exiting getURLParamFromNativeError()", "DEBUG", false); }
    return pValue;
}


function setSelectsSelectedIndex(select, aValue) {
    if (logLevel >= 4) { logToWorkflow("entering setSelectsSelectedIndex()", "DEBUG", false); }
    var i;
    for (i = 0; i < select.options.length; i++) {
        if (select.options[i].value === aValue) {
            select.selectedIndex = i;
        }
    }
    if (logLevel >= 4) { logToWorkflow("exiting setSelectsSelectedIndex()", "DEBUG", false); }
}


function reportRMIError(errorCode, onErrorMsg, nativeMsg) {
    if (onErrorMsg) {
        showAlertDialog(onErrorMsg);
    }
    else if (nativeMsg) {
        showAlertDialog(nativeMsg);
    }
}