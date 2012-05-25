var old_record;

function proxy_createfn(callback)
{
	menuItemCallbackCustomercreateOnline_Request();
	mboCallback = callback;
}

function proxy_readfn(callback)
{
	menuItemCallbackStartGet_Customers();
	mboCallback = callback;
}

function proxy_updatefn(callback)
{
	menuItemCallbackCustomerupdateinstanceOnline_Request();
	mboCallback = callback;
}

function proxy_deletefn(callback)
{
	menuItemCallbackCustomerdeleteinstanceOnline_Request();
	mboCallback = callback;
}

