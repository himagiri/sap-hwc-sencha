/*
 * Sybase Mobile Workflow version 2.1.3
 * 
 * ExternalResource.js
 *
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 *
 * Last Updated: 2011/6/24   
 * Copyright (c) 2011 Sybase Inc. All rights reserved.
 *
 */

(function() {
    /**
    * Makes an external cross domain request
    * 
    * @param url The url to make request to
    * @param options The options provided for the request
    */
    window.getExternalResource = function(url, options) {

        // Default options
        var _options = {
            method: "GET",
            async: true
            //headers: {},
            //data: '',
            //complete: function() {}
        };

        // Fill in options
        options = options || {};

        for (var key in options) {
            _options[key] = options[key];
        }

        options = _options;
        options.method = options.method.toUpperCase();

        // Format params
        var params = [];

        if (typeof (options.data) == 'string') {
            params.push(options.data);
        }
		else if (Object.prototype.toString.call(options.data) === '[object Array]') {
			params = options.data;
		}
        else {
            for (var key in options.data) {
                params.push(encodeURIComponent(key) + "=" + encodeURIComponent(options.data[key]));
            }
        }

        // Format query string and post data
        var queryString = params.join("&");

        if (queryString) {
            if (options.method === "GET") {
                url = url + (url.indexOf("?") == -1 ? '?' : '&') + queryString;
                options.data = "";
            }
            else {
                options.data = queryString;
            }
        }

        // Make request
        if (isBlackBerry()) {
            var request = getXMLHTTPRequest();
            request.open(options.method, url, options.async);

            if (options.headers) {
                for (var key in options.headers) {
                    request.setRequestHeader(key, options.headers[key]);
                }
            }

            request.onreadystatechange = function() {
                if (request.readyState == 4) {
                    handleResponse(options, request);
                }
            }

            request.send(options.data);
        }
        else if (isAndroid()){
            if (options.async) {
                // Setup callbacks
                var callbackSet = new CallbackSet();
                options.callback = callbackSet.registerCallback("callback", function(response) { handleResponse(options, response) });
            }

			// Create a json string for options
            var jsonOptions = JSON.stringify(options);
			
            var jsonText = _WorkflowContainer.makeExternalRequest(url, jsonOptions) + '';

            if (!options.async && jsonText) {
                handleResponse(options, JSON.parse(jsonText));
            }
        }
        else if (isWindowsMobile() || isWindows()) {
			// Create a json string for options
            var jsonOptions = JSON.stringify(options);
		
            try {
                //make xmlhttp request to load the rmi response from server
                xmlhttp = getXMLHTTPRequest();

                //container always sends the request as synced, javascript sends the request based on
                //caller's choice
                xmlhttp.open("POST", "/sup.amp?querytype=externalresource&version=2.1.3", options.async);

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4) {
                        // Success
                        if (xmlhttp.status === 200) {
                            handleResponse(options, JSON.parse(xmlhttp.responseText))
                        }
                    }
                }
                
                xmlhttp.send("url=" + encodeURIComponent(url) + "&options=" + encodeURIComponent(jsonOptions));
            }
            catch (ex) {
                alert(ex);
            }
        }
        else if (isIOS()) {
            // Create a json string for options
            var jsonOptions = JSON.stringify(options);
		
            try {
                //make xmlhttp request to load the rmi response from server
                xmlhttp = getXMLHTTPRequest();

                //container always sends the request as synced, javascript sends the request based on
                //caller's choice
                xmlhttp.open("GET", "/sup.amp?querytype=externalresource&version=2.1.3&url=" + encodeURIComponent(url) + "&options=" + encodeURIComponent(jsonOptions), options.async);                
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4) {
                        // Success
                        handleResponse(options, JSON.parse(xmlhttp.responseText))
                    }
                }

                xmlhttp.send();

            }
            catch (ex) {
                alert(ex);
            }
       }
    };

    /**
    * Internal method to wrap response in a fake xhr
    * 
    * @param options The options provided for the request
    * @param response The response provided by the container
    */
    function handleResponse(options, response) {
        var fakeXHR = {
            "status": response.status,
            "statusText": response.statusText,
            "responseText": response.responseText,
            "getResponseHeader": function(key) {
                var headerValue;

                if (response.getResponseHeader)
                    headerValue = response.getResponseHeader(key);
                else if (response.headers)
				{
					for (var header in response.headers) {
						if ( key.toLowerCase() === header.toLowerCase() )
						{
							headerValue = response.headers[header];
							break;
						}
					}
				}
				
                return headerValue === undefined ? null : headerValue;
            },
            "getAllResponseHeaders": function() {
                if (response.getAllResponseHeaders)
                    return response.getAllResponseHeaders();

                if (response.headers) {
                    var allHeaders;

                    for (var key in response.headers) {
                        if (allHeaders)
                            allHeaders += "\r\n";

                        allHeaders += (key + ":" + response.headers[key]);
                    }
                    return allHeaders;
                }

                return null;
            }
        };

        if (options.complete)
            options.complete(fakeXHR);
    };

} ());
