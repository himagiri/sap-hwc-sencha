/*
 * Sybase Mobile Workflow version 2.1.3
 * 
 * Camera.js
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 * Last Updated: 2011/09/08
 *
 * Copyright (c) 2011 Sybase Inc. All rights reserved.
 */

/**
 * Example: getPicture(fail,
 *                     success,
 *                     { sourceType: PictureOption.SourceType.CAMERA,
 *                       destinationType: PictureOption.DestinationType.IMAGE_URI
 *                     })
 */

/** An array that holds all possible option codes for use with getPicture() */
PictureOption = [];

PictureOption.SourceType = {
    CAMERA: 1,              // Specifies the built-in camera as the image source where image content is not persisted by the device
    PHOTOLIBRARY: 2,        // Specifies the photo library as the image source where image content is already persisted on the device
    BOTH: 3                 // Specifies the built-in camera as the image source where image content is persisted by the device
};

PictureOption.DestinationType = {
    IMAGE_DATA: 0,          // Returns base64 encoded string (deprecated)
    IMAGE_URI: 1            // Returns uniform reference identifier for the image
};

/**
 * DEPRECATED
 * Open a platform-specific application allowing the user to capture an image
 * using the built-in camera.
 */
PictureOption.CAMERA = PictureOption.SourceType.CAMERA;

/**
 * DEPRECATED
 * Open a platform-specific application allowing the user to select an
 * existing picture from a gallery.
 */
PictureOption.PHOTOLIBRARY = PictureOption.SourceType.PHOTOLIBRARY;

/** An array that holds all possible error codes */
PictureError = [];

/** No error */
PictureError.NO_ERROR      =  0;

/** getPicture() not implemented, camera not present, etc. */ 
PictureError.NOT_SUPPORTED = -1;

/** getPicture() has already been requested but has not yet completed. */
PictureError.IN_PROGRESS   = -2;

/** The user has canceled the request. */
PictureError.USER_REJECT   = -3;

/** Supplied options were not recognized. */
PictureError.BAD_OPTIONS   = -4;

/** The returned image size was too large to be handled by JavaScript */
PictureError.TOO_LARGE     = -5;

/** An unknown error occurred. */
PictureError.UNKNOWN       = -6;

/** A namespace for our private use */
_Picture = new function() {};

/**
 * Requests retrieval of a picture asynchronously.
 * 
 * @param onGetPictureError(err) Function to be invoked if the attempt to get
 *     a picture fails. err will be one of the PictureError codes.
 * @param onGetPictureSuccess(fileName, response) Function to be invoked if a picture is
 *     successfully retrieved. response will either be a Base64-encoded JPG string or a URI.
 * @param options Options as defined by PictureOption values.
 */
getPicture = function(onGetPictureError, onGetPictureSuccess, options)
{
    // Return if callback functions are not provided
    if (typeof onGetPictureError !== 'function' ||
        typeof onGetPictureSuccess !== 'function') {
        return;
    }

    if ("_onGetPictureSuccess" in _Picture &&
        _Picture._onGetPictureSuccess != null) {
        // Already requested but not yet complete
        onGetPictureError(PictureError.IN_PROGRESS);
        return;
    }
    
    _Picture._onGetPictureError = onGetPictureError;
    _Picture._onGetPictureSuccess = onGetPictureSuccess;

    // Convert options parameter to object notation if number type and return image data to preserve behavior
    // of previous release
    if (typeof options === 'number') {
        options =  { destinationType: PictureOption.DestinationType.IMAGE_DATA,
                     sourceType: options
                   };
    }

    // Convert options object to serialized JSON text in preparation for submission to the container
    options = JSON.stringify(options);

    if (isWindowsMobile()) {
        var xmlHttpReq = getXMLHTTPRequest();
        xmlHttpReq.open("GET", "/sup.amp?querytype=getPicture&PictureOptions=" + encodeURIComponent(options) + "&" + versionURLParam, false);
        xmlHttpReq.send("");
    } else if (isIOS()) {
        var xmlHttpReq = getXMLHTTPRequest();
        xmlHttpReq.open("GET", "/sup.amp?querytype=getPicture&PictureOptions=" + encodeURIComponent(options) + "&" + versionURLParam, true);
        xmlHttpReq.send("");
    } else {
        _WorkflowContainer.getPicture(options);
    }
}

/**
 * (Internal) Invoked asynchronously when the image arrives.
 * 
 * @param result The PictureError code, or PictureError.NO_ERROR for
 *     success.
 * @param filename Filename corresponding to the image.
 * @param imageData Base64-encoded String containing the image data. Undefined
 *     if the result parameter indicates an error or the image URI was requested.
 * @param imageUri Uniform resource indicator of the image resource.  Undefined
 *     if the result parameter indicates an error or the image data was requested.
 */
_Picture._getPictureComplete = function(result, fileName, imageData, imageUri) {
    var successFunc = _Picture._onGetPictureSuccess;
    var errorFunc = _Picture._onGetPictureError;
    _Picture._onGetPictureSuccess = null;
    _Picture._onGetPictureError = null;

    if (result == PictureError.NO_ERROR) {
        if (imageData) {
            // For WM client, the picture data is too big to be passed from url, so only
            // the unique key is sent from container to JavaScript.  JavaScript needs to send
            // another xmlhttprequest to fetch the actual data
            if (isWindowsMobile()) {
                var xmlHttpReq = getXMLHTTPRequest();
                xmlHttpReq.open("GET", "/sup.amp?querytype=getpicturedata&pictureid=" + imageData + "&" + versionURLParam, false);
                xmlHttpReq.send("");

                response = xmlHttpReq.responseText;
                successFunc(fileName, response);
            } else {
                successFunc(fileName, imageData);
            }
        } else if (imageUri) {
            successFunc(fileName, imageUri);
        } else {
            errorFunc(PictureError.UNKNOWN);
        }
    } else {
        errorFunc(result);
    }
}
