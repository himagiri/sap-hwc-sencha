/*
 * Sybase Mobile Workflow version 2.1.3
 * 
 * Workflow.js
 * This file will be regenerated, so changes made herein will be removed the
 * next time the workflow is regenerated. It is therefore strongly recommended
 * that the user not make changes in this file.
 * 
 * The template used to create this file was compiled on Fri Mar 23 21:29:10 PDT 2012
 *
 * Copyright (c) 2010, 2011 Sybase Inc. All rights reserved.
 */



function menuItemCallbackStartCancel() {
    if (!customBeforeMenuItemClick('Start', 'Cancel')) {
        return;
    }
    doCancelAction();
    customAfterMenuItemClick('Start', 'Cancel');
}


function menuItemCallbackStartGet_Customers() {
    if (!customBeforeMenuItemClick('Start', 'Get_Customers')) {
        return;
    }
    var rmiKeys = [];
    var rmiKeyTypes = [];
    var rmiInputOnlyKeys = [];
    var rmiInputOnlyKeyTypes = [];
    var workflowMessageToSend = getMessageValueCollectionForOnlineRequest('Start', 'Get_Customers', rmiKeys, rmiKeyTypes);
    var inputOnlyWorkflowMessageToSend = getMessageValueCollectionForOnlineRequest('Start', 'Get_Customers', rmiInputOnlyKeys, rmiInputOnlyKeyTypes);
    if (validateScreen('Start', getCurrentMessageValueCollection(), rmiKeys) && 
        saveScreens(true)) {
        doOnlineRequest('Start', 'Get_Customers', 60, 0, '', null, workflowMessageToSend, inputOnlyWorkflowMessageToSend.serializeToString());
    }
    customAfterMenuItemClick('Start', 'Get_Customers');
}


function menuItemCallbackCustomercreateOnline_Request() {
    if (!customBeforeMenuItemClick('Customercreate', 'Online_Request')) {
        return;
    }
    var rmiKeys = [];
    var rmiKeyTypes = [];
    var rmiInputOnlyKeys = [];
    var rmiInputOnlyKeyTypes = [];
    rmiKeys[0] = 'Customer_create_id_paramKey';
    rmiKeyTypes[0] = 'NUMBER';
    rmiKeys[1] = 'Customer_create_fname_paramKey';
    rmiKeyTypes[1] = 'TEXT';
    rmiKeys[2] = 'Customer_create_lname_paramKey';
    rmiKeyTypes[2] = 'TEXT';
    rmiKeys[3] = 'Customer_create_address_paramKey';
    rmiKeyTypes[3] = 'TEXT';
    rmiKeys[4] = 'Customer_create_city_paramKey';
    rmiKeyTypes[4] = 'TEXT';
    rmiKeys[5] = 'Customer_create_state_paramKey';
    rmiKeyTypes[5] = 'TEXT';
    rmiKeys[6] = 'Customer_create_zip_paramKey';
    rmiKeyTypes[6] = 'TEXT';
    rmiKeys[7] = 'Customer_create_phone_paramKey';
    rmiKeyTypes[7] = 'TEXT';
    rmiKeys[8] = 'Customer_create_company_name_paramKey';
    rmiKeyTypes[8] = 'TEXT';
    rmiKeys[9] = 'ErrorLogs';
    rmiKeyTypes[9] = 'LIST';
    rmiInputOnlyKeys[0] = 'Customer_create_id_paramKey';
    rmiInputOnlyKeyTypes[0] = 'NUMBER';
    rmiInputOnlyKeys[1] = 'Customer_create_fname_paramKey';
    rmiInputOnlyKeyTypes[1] = 'TEXT';
    rmiInputOnlyKeys[2] = 'Customer_create_lname_paramKey';
    rmiInputOnlyKeyTypes[2] = 'TEXT';
    rmiInputOnlyKeys[3] = 'Customer_create_address_paramKey';
    rmiInputOnlyKeyTypes[3] = 'TEXT';
    rmiInputOnlyKeys[4] = 'Customer_create_city_paramKey';
    rmiInputOnlyKeyTypes[4] = 'TEXT';
    rmiInputOnlyKeys[5] = 'Customer_create_state_paramKey';
    rmiInputOnlyKeyTypes[5] = 'TEXT';
    rmiInputOnlyKeys[6] = 'Customer_create_zip_paramKey';
    rmiInputOnlyKeyTypes[6] = 'TEXT';
    rmiInputOnlyKeys[7] = 'Customer_create_phone_paramKey';
    rmiInputOnlyKeyTypes[7] = 'TEXT';
    rmiInputOnlyKeys[8] = 'Customer_create_company_name_paramKey';
    rmiInputOnlyKeyTypes[8] = 'TEXT';
    rmiInputOnlyKeys[9] = 'ErrorLogs';
    rmiInputOnlyKeyTypes[9] = 'LIST';
    var workflowMessageToSend = getMessageValueCollectionForOnlineRequest('Customercreate', 'Online_Request', rmiKeys, rmiKeyTypes);
    var inputOnlyWorkflowMessageToSend = getMessageValueCollectionForOnlineRequest('Customercreate', 'Online_Request', rmiInputOnlyKeys, rmiInputOnlyKeyTypes);
    if (validateScreen('Customercreate', getCurrentMessageValueCollection(), rmiKeys) && 
        saveScreens(true)) {
        doOnlineRequest('Customercreate', 'Online_Request', 60, 0, '', null, workflowMessageToSend, inputOnlyWorkflowMessageToSend.serializeToString());
    }
    customAfterMenuItemClick('Customercreate', 'Online_Request');
}


function menuItemCallbackCustomercreateCancel() {
    if (!customBeforeMenuItemClick('Customercreate', 'Cancel')) {
        return;
    }
    doCancelAction();
    customAfterMenuItemClick('Customercreate', 'Cancel');
}


function menuItemCallbackCustomerupdateinstanceOnline_Request() {
    if (!customBeforeMenuItemClick('Customerupdateinstance', 'Online_Request')) {
        return;
    }
    var rmiKeys = [];
    var rmiKeyTypes = [];
    var rmiInputOnlyKeys = [];
    var rmiInputOnlyKeyTypes = [];
    rmiKeys[0] = 'Customer_fname_attribKey';
    rmiKeyTypes[0] = 'TEXT';
    rmiKeys[1] = '_old.Customer.fname';
    rmiKeyTypes[1] = 'TEXT';
    rmiKeys[2] = 'Customer_lname_attribKey';
    rmiKeyTypes[2] = 'TEXT';
    rmiKeys[3] = '_old.Customer.lname';
    rmiKeyTypes[3] = 'TEXT';
    rmiKeys[4] = 'Customer_address_attribKey';
    rmiKeyTypes[4] = 'TEXT';
    rmiKeys[5] = '_old.Customer.address';
    rmiKeyTypes[5] = 'TEXT';
    rmiKeys[6] = 'Customer_city_attribKey';
    rmiKeyTypes[6] = 'TEXT';
    rmiKeys[7] = '_old.Customer.city';
    rmiKeyTypes[7] = 'TEXT';
    rmiKeys[8] = 'Customer_state_attribKey';
    rmiKeyTypes[8] = 'TEXT';
    rmiKeys[9] = '_old.Customer.state';
    rmiKeyTypes[9] = 'TEXT';
    rmiKeys[10] = 'Customer_zip_attribKey';
    rmiKeyTypes[10] = 'TEXT';
    rmiKeys[11] = '_old.Customer.zip';
    rmiKeyTypes[11] = 'TEXT';
    rmiKeys[12] = 'Customer_phone_attribKey';
    rmiKeyTypes[12] = 'TEXT';
    rmiKeys[13] = '_old.Customer.phone';
    rmiKeyTypes[13] = 'TEXT';
    rmiKeys[14] = 'Customer_company_name_attribKey';
    rmiKeyTypes[14] = 'TEXT';
    rmiKeys[15] = '_old.Customer.company_name';
    rmiKeyTypes[15] = 'TEXT';
    rmiKeys[16] = 'Customer_id_attribKey';
    rmiKeyTypes[16] = 'NUMBER';
    rmiKeys[17] = '_old.Customer.id';
    rmiKeyTypes[17] = 'NUMBER';
    rmiKeys[18] = 'ErrorLogs';
    rmiKeyTypes[18] = 'LIST';
    rmiInputOnlyKeys[0] = 'Customer_fname_attribKey';
    rmiInputOnlyKeyTypes[0] = 'TEXT';
    rmiInputOnlyKeys[1] = '_old.Customer.fname';
    rmiInputOnlyKeyTypes[1] = 'TEXT';
    rmiInputOnlyKeys[2] = 'Customer_lname_attribKey';
    rmiInputOnlyKeyTypes[2] = 'TEXT';
    rmiInputOnlyKeys[3] = '_old.Customer.lname';
    rmiInputOnlyKeyTypes[3] = 'TEXT';
    rmiInputOnlyKeys[4] = 'Customer_address_attribKey';
    rmiInputOnlyKeyTypes[4] = 'TEXT';
    rmiInputOnlyKeys[5] = '_old.Customer.address';
    rmiInputOnlyKeyTypes[5] = 'TEXT';
    rmiInputOnlyKeys[6] = 'Customer_city_attribKey';
    rmiInputOnlyKeyTypes[6] = 'TEXT';
    rmiInputOnlyKeys[7] = '_old.Customer.city';
    rmiInputOnlyKeyTypes[7] = 'TEXT';
    rmiInputOnlyKeys[8] = 'Customer_state_attribKey';
    rmiInputOnlyKeyTypes[8] = 'TEXT';
    rmiInputOnlyKeys[9] = '_old.Customer.state';
    rmiInputOnlyKeyTypes[9] = 'TEXT';
    rmiInputOnlyKeys[10] = 'Customer_zip_attribKey';
    rmiInputOnlyKeyTypes[10] = 'TEXT';
    rmiInputOnlyKeys[11] = '_old.Customer.zip';
    rmiInputOnlyKeyTypes[11] = 'TEXT';
    rmiInputOnlyKeys[12] = 'Customer_phone_attribKey';
    rmiInputOnlyKeyTypes[12] = 'TEXT';
    rmiInputOnlyKeys[13] = '_old.Customer.phone';
    rmiInputOnlyKeyTypes[13] = 'TEXT';
    rmiInputOnlyKeys[14] = 'Customer_company_name_attribKey';
    rmiInputOnlyKeyTypes[14] = 'TEXT';
    rmiInputOnlyKeys[15] = '_old.Customer.company_name';
    rmiInputOnlyKeyTypes[15] = 'TEXT';
    rmiInputOnlyKeys[16] = 'Customer_id_attribKey';
    rmiInputOnlyKeyTypes[16] = 'NUMBER';
    rmiInputOnlyKeys[17] = '_old.Customer.id';
    rmiInputOnlyKeyTypes[17] = 'NUMBER';
    rmiInputOnlyKeys[18] = 'ErrorLogs';
    rmiInputOnlyKeyTypes[18] = 'LIST';
    var workflowMessageToSend = getMessageValueCollectionForOnlineRequest('Customerupdateinstance', 'Online_Request', rmiKeys, rmiKeyTypes);
    var inputOnlyWorkflowMessageToSend = getMessageValueCollectionForOnlineRequest('Customerupdateinstance', 'Online_Request', rmiInputOnlyKeys, rmiInputOnlyKeyTypes);
    if (validateScreen('Customerupdateinstance', getCurrentMessageValueCollection(), rmiKeys) && 
        saveScreens(true)) {
        doOnlineRequest('Customerupdateinstance', 'Online_Request', 60, 0, '', null, workflowMessageToSend, inputOnlyWorkflowMessageToSend.serializeToString());
    }
    customAfterMenuItemClick('Customerupdateinstance', 'Online_Request');
}


function menuItemCallbackCustomerupdateinstanceCancel() {
    if (!customBeforeMenuItemClick('Customerupdateinstance', 'Cancel')) {
        return;
    }
    doCancelAction();
    customAfterMenuItemClick('Customerupdateinstance', 'Cancel');
}


function menuItemCallbackCustomerdeleteinstanceOnline_Request() {
    if (!customBeforeMenuItemClick('Customerdeleteinstance', 'Online_Request')) {
        return;
    }
    var rmiKeys = [];
    var rmiKeyTypes = [];
    var rmiInputOnlyKeys = [];
    var rmiInputOnlyKeyTypes = [];
    rmiKeys[0] = 'Customer_id_attribKey';
    rmiKeyTypes[0] = 'NUMBER';
    rmiKeys[1] = '_old.Customer.id';
    rmiKeyTypes[1] = 'NUMBER';
    rmiKeys[2] = 'Customer_fname_attribKey';
    rmiKeyTypes[2] = 'TEXT';
    rmiKeys[3] = '_old.Customer.fname';
    rmiKeyTypes[3] = 'TEXT';
    rmiKeys[4] = 'Customer_lname_attribKey';
    rmiKeyTypes[4] = 'TEXT';
    rmiKeys[5] = '_old.Customer.lname';
    rmiKeyTypes[5] = 'TEXT';
    rmiKeys[6] = 'Customer_address_attribKey';
    rmiKeyTypes[6] = 'TEXT';
    rmiKeys[7] = '_old.Customer.address';
    rmiKeyTypes[7] = 'TEXT';
    rmiKeys[8] = 'Customer_city_attribKey';
    rmiKeyTypes[8] = 'TEXT';
    rmiKeys[9] = '_old.Customer.city';
    rmiKeyTypes[9] = 'TEXT';
    rmiKeys[10] = 'Customer_state_attribKey';
    rmiKeyTypes[10] = 'TEXT';
    rmiKeys[11] = '_old.Customer.state';
    rmiKeyTypes[11] = 'TEXT';
    rmiKeys[12] = 'Customer_zip_attribKey';
    rmiKeyTypes[12] = 'TEXT';
    rmiKeys[13] = '_old.Customer.zip';
    rmiKeyTypes[13] = 'TEXT';
    rmiKeys[14] = 'Customer_phone_attribKey';
    rmiKeyTypes[14] = 'TEXT';
    rmiKeys[15] = '_old.Customer.phone';
    rmiKeyTypes[15] = 'TEXT';
    rmiKeys[16] = 'Customer_company_name_attribKey';
    rmiKeyTypes[16] = 'TEXT';
    rmiKeys[17] = '_old.Customer.company_name';
    rmiKeyTypes[17] = 'TEXT';
    rmiKeys[18] = 'ErrorLogs';
    rmiKeyTypes[18] = 'LIST';
    rmiInputOnlyKeys[0] = 'Customer_id_attribKey';
    rmiInputOnlyKeyTypes[0] = 'NUMBER';
    rmiInputOnlyKeys[1] = '_old.Customer.id';
    rmiInputOnlyKeyTypes[1] = 'NUMBER';
    rmiInputOnlyKeys[2] = 'Customer_fname_attribKey';
    rmiInputOnlyKeyTypes[2] = 'TEXT';
    rmiInputOnlyKeys[3] = '_old.Customer.fname';
    rmiInputOnlyKeyTypes[3] = 'TEXT';
    rmiInputOnlyKeys[4] = 'Customer_lname_attribKey';
    rmiInputOnlyKeyTypes[4] = 'TEXT';
    rmiInputOnlyKeys[5] = '_old.Customer.lname';
    rmiInputOnlyKeyTypes[5] = 'TEXT';
    rmiInputOnlyKeys[6] = 'Customer_address_attribKey';
    rmiInputOnlyKeyTypes[6] = 'TEXT';
    rmiInputOnlyKeys[7] = '_old.Customer.address';
    rmiInputOnlyKeyTypes[7] = 'TEXT';
    rmiInputOnlyKeys[8] = 'Customer_city_attribKey';
    rmiInputOnlyKeyTypes[8] = 'TEXT';
    rmiInputOnlyKeys[9] = '_old.Customer.city';
    rmiInputOnlyKeyTypes[9] = 'TEXT';
    rmiInputOnlyKeys[10] = 'Customer_state_attribKey';
    rmiInputOnlyKeyTypes[10] = 'TEXT';
    rmiInputOnlyKeys[11] = '_old.Customer.state';
    rmiInputOnlyKeyTypes[11] = 'TEXT';
    rmiInputOnlyKeys[12] = 'Customer_zip_attribKey';
    rmiInputOnlyKeyTypes[12] = 'TEXT';
    rmiInputOnlyKeys[13] = '_old.Customer.zip';
    rmiInputOnlyKeyTypes[13] = 'TEXT';
    rmiInputOnlyKeys[14] = 'Customer_phone_attribKey';
    rmiInputOnlyKeyTypes[14] = 'TEXT';
    rmiInputOnlyKeys[15] = '_old.Customer.phone';
    rmiInputOnlyKeyTypes[15] = 'TEXT';
    rmiInputOnlyKeys[16] = 'Customer_company_name_attribKey';
    rmiInputOnlyKeyTypes[16] = 'TEXT';
    rmiInputOnlyKeys[17] = '_old.Customer.company_name';
    rmiInputOnlyKeyTypes[17] = 'TEXT';
    rmiInputOnlyKeys[18] = 'ErrorLogs';
    rmiInputOnlyKeyTypes[18] = 'LIST';
    var workflowMessageToSend = getMessageValueCollectionForOnlineRequest('Customerdeleteinstance', 'Online_Request', rmiKeys, rmiKeyTypes);
    var inputOnlyWorkflowMessageToSend = getMessageValueCollectionForOnlineRequest('Customerdeleteinstance', 'Online_Request', rmiInputOnlyKeys, rmiInputOnlyKeyTypes);
    if (validateScreen('Customerdeleteinstance', getCurrentMessageValueCollection(), rmiKeys) && 
        saveScreens(true)) {
        doOnlineRequest('Customerdeleteinstance', 'Online_Request', 60, 0, '', null, workflowMessageToSend, inputOnlyWorkflowMessageToSend.serializeToString());
    }
    customAfterMenuItemClick('Customerdeleteinstance', 'Online_Request');
}


function menuItemCallbackCustomerdeleteinstanceCancel() {
    if (!customBeforeMenuItemClick('Customerdeleteinstance', 'Cancel')) {
        return;
    }
    doCancelAction();
    customAfterMenuItemClick('Customerdeleteinstance', 'Cancel');
}


function menuItemCallbackCustomerDetailOpen_Customerupdateinstance() {
    if (!customBeforeMenuItemClick('CustomerDetail', 'Open_Customerupdateinstance')) {
        return;
    }
    navigateForward('Customerupdateinstance');
    customAfterMenuItemClick('CustomerDetail', 'Open_Customerupdateinstance');
}


function menuItemCallbackCustomerDetailOpen_Customerdeleteinstance() {
    if (!customBeforeMenuItemClick('CustomerDetail', 'Open_Customerdeleteinstance')) {
        return;
    }
    navigateForward('Customerdeleteinstance');
    customAfterMenuItemClick('CustomerDetail', 'Open_Customerdeleteinstance');
}


function menuItemCallbackCustomerDetailBack() {
    if (!customBeforeMenuItemClick('CustomerDetail', 'Back')) {
        return;
    }
    doSaveAction();
    customAfterMenuItemClick('CustomerDetail', 'Back');
}
function menuItemCallbackCustomerDetailCancel() {
    if (!customBeforeMenuItemClick('CustomerDetail', 'Cancel')) {
        return;
    }
    doCancelAction();
    customAfterMenuItemClick('CustomerDetail', 'Cancel');
}


function menuItemCallbackCustomerSubmit() {
    if (!customBeforeMenuItemClick('Customer', 'Submit')) {
        return;
    }

    if (saveScreens()) {
        doSubmitWorkflow('Customer', 'Submit', '', '');
    }
    customAfterMenuItemClick('Customer', 'Submit');
}


function menuItemCallbackCustomerCancel() {
    if (!customBeforeMenuItemClick('Customer', 'Cancel')) {
        return;
    }
    doCancelAction();
    customAfterMenuItemClick('Customer', 'Cancel');
}

function doAddRowAction() {
    var mvc = getCurrentMessageValueCollection();
    var listview = getListviewMessageValue();
    if (listview) {
        var childMVC = new MessageValueCollection();
        var key = guid();
        childMVC.setKey(key);
        childMVC.setState("new");
        childMVC.setParent(listview.getKey());
        childMVC.setParentValue(listview);
        listview.getValue().push(childMVC);
        console.log(workflowMessage.serializeToString());
        if (validateScreen(getCurrentScreen(), mvc)) {
            listViewValuesKey.pop();
            listViewValuesKey.push(childMVC.getKey());
            doListviewAddRowAction();
            console.log(workflowMessage.serializeToString());
        }
    }
}

function doCreateKeyCollectionAction(addScreen) {
    var mvc = getCurrentMessageValueCollection();
    var relationKey = getListViewKey(getCurrentScreen());
    var mv = mvc.getData(relationKey);
    var childMVC = new MessageValueCollection();
    var key = guid();
    childMVC.setKey(key);
    childMVC.setState("new");
    childMVC.setParent(mv.getKey());
    childMVC.setParentValue(mv);
    mv.getValue().push(childMVC);
    setDefaultValues(addScreen);
    // collect default values from the addScreen
    updateMessageValueCollectionFromUI(childMVC, addScreen);
    navigateForward(addScreen, key);
}

function doListviewAddRowAction(listKey) {
    var mvc = getCurrentMessageValueCollection(listKey);
    if (mvc.getState() === "new") {
        // this action is triggered after AddRow action
        if (validateScreen(getCurrentScreen(), mvc)) {
            mvc.setState("add");
            doSaveAction(false);
        }
    }
}

function doListviewUpdateRowAction(listKey) {
    var mvc = getCurrentMessageValueCollection(listKey);
    if (validateScreen(getCurrentScreen(), mvc)) {
        if (mvc.getState() !== "add") {
            mvc.setState("update");            
        }
        doSaveAction(false);
    }
}

function doListviewDeleteRowAction(listKey) {
    var mvc = getCurrentMessageValueCollection(listKey);
    if (validateScreen(getCurrentScreen(), mvc)) {
        if (mvc.getState() !== "add") {
            mvc.setState("delete");            
            doSaveAction(false);
        }
        else {
            var valuesArray = mvc.getParentValue().getValue();
            for (var i = 0; i < valuesArray.length; i++) {
                if (valuesArray[i] == mvc) {
                    valuesArray.splice(i, 1);
                }
            }
            navigateBack(true);
            updateUIFromMessageValueCollection(getCurrentScreen(), getCurrentMessageValueCollection());
        }        
    }
}

function doSaveActionWithoutReturn() {
   doSaveAction();
   return;
}

function doSaveAction(needValidation) {
    if (!getPreviousScreen()) {
        if(saveScreen(getCurrentMessageValueCollection(), getCurrentScreen(), needValidation)) {
            doSubmitWorkflow(getCurrentScreen(), "Save", '', '');
            return false;
        }
        return true;
    }
    if(saveScreen(getCurrentMessageValueCollection(), getCurrentScreen(), needValidation)) {
        navigateBack(false, false);
        updateUIFromMessageValueCollection(getCurrentScreen(), getCurrentMessageValueCollection());
        return true;
    }
    return false;
}

function doCancelAction() {
    if (!getPreviousScreen()) {
        closeWorkflow();
        return;
    }
    
    var mvc = getCurrentMessageValueCollection();
    navigateBack(true);
    var mvc1 = getCurrentMessageValueCollection();
    
    //if we are moving onto a listview screen we should delete any newly added rows
    if (mvc != mvc1) {
        //find the items of the listview and if any of them are marked as new, delete them.
        var messValues = mvc1.getValues();
        for (var i = 0; i < messValues.length; i++) {
            if (messValues[i].getType() === "LIST") {
                var listViewValuesArray = messValues[i].getValue()
                for (var j = 0; j < listViewValuesArray.length; j++) {
                    if (listViewValuesArray[j].getState() === "new") {
                        listViewValuesArray.splice(j, 1);
                        j--;
                    }
                }
            }        
        }
        updateUIFromMessageValueCollection(getCurrentScreen(), getCurrentMessageValueCollection());
    }
    else if (mvc.getState() === "update") {
        mvc.setState("");
    }
}

function customNavigationEntry() {
    this.condition;
    this.screen;
}
function customNavigationEntry( a_condition, a_screen ) {
    this.condition = a_condition;
    this.screen = a_screen;
}

/**
 * For the specific pair - screen named 'currentScreenKey' and the action 'actionName', return
 * the list of custom navigation condition-names and their destination screens.
 */
function getCustomNavigations( currentScreenKey, actionName )  {
    var customNavigations = new Array();
    return customNavigations;
}
