/*
 * Sybase Mobile Workflow version 2.1.3
 * 
 * Certificate.js
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 * 
 * Last Updated: 2011/6/29   
 *
 * Copyright (c) 2011 Sybase Inc. All rights reserved.
 *
 * Note a certificate object will have the following fields
	- issuerCN - The common name (CN) from the certificate issuer's distinguished name. 
	- issuerDN - The certificate issuer's distinguished name, in string form. 
	- notAfter - End time for certificate's validity period, with date/time fields as they would appear in UTC. 
	- notBefore - Start time for the certificate's validity period, with date/time fields as they would appear in UTC. 
	- signedCertificate - The digitally signed certificate in Base64 format
	- subjectCN - The common name (CN) from the certificate subject's distinguished name. 
	- subjectDN - The certificate subject's distinguished name, in string form. 
  */

/**
 * This class represents an X.509 public certificate store.
 */
function CertificateStore() {
}

(function() {
    function parseCertDate(value) {
        var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
    }

    function createCert(value) {
        if (value == null || typeof value == 'undefined' || value.length == 0)
            return null;

        var cert = JSON.parse(value);

        if (cert.notAfter) {
            cert.notAfter = new Date(parseCertDate(cert.notAfter));
        }
        if (cert.notBefore) {
            cert.notBefore = new Date(parseCertDate(cert.notBefore));
        }

        return cert;
    }

    /**
    * Each certificate in this store has a unique label. 
    * Returns a list of all the certificate labels in this store (can be empty). 
    * 
    * Supported Platforms: Windows Mobile and BlackBerry
    * 
    * @param filterSubject filter of subject
    * @param filterIssuer filter of issuer
    * @return Only filtered certificate labels
    */
    CertificateStore.prototype.certificateLabels = function(filterSubject, filterIssuer) {
        filterSubject = filterSubject ? filterSubject : "";
        filterIssuer = filterIssuer ? filterIssuer : "";

        var response = "";

        if (isWindowsMobile()) {
            var xmlHttpReq = getXMLHTTPRequest();
            xmlHttpReq.open("GET", "/sup.amp?querytype=certificatestore&version=2.1.3&command=certificateLabels" +
					"&filterSubject=" + encodeURIComponent(filterSubject) + "&filterIssuer=" + encodeURIComponent(filterIssuer), false);
            xmlHttpReq.send("");

            response = xmlHttpReq.responseText;
        }
        else if (isBlackBerry()) {
            response = _WorkflowContainer.getCertificateLabels(filterSubject, filterIssuer);
        }
        else {
            throw "Not supported on this platform";
        }

        return eval('(' + response + ')');
    };

    /**
    * Returns a certificate without the signedCertificate part set
    */
    CertificateStore.getDefault = function() {
        return new CertificateStore();
    };

    /**
    * Returns a certificate without the signedCertificate part set
    * 
    * Supported Platforms: Windows Mobile and BlackBerry
    * 
    *  @param label label of the desired certificate
    */
    CertificateStore.prototype.getPublicCertificate = function(label) {
        var response = "";

        if (isWindowsMobile()) {
            var xmlHttpReq = getXMLHTTPRequest();
            xmlHttpReq.open("GET", "/sup.amp?querytype=certificatestore&version=2.1.3&command=getPublicCertificate" +
					"&label=" + encodeURIComponent(label), false);
            xmlHttpReq.send("");

            response = xmlHttpReq.responseText;
        }
        else if (isBlackBerry()) {
            response = _WorkflowContainer.getPublicCertificate(label);
        }
        else {
            throw "Not supported on this platform";
        }

        return createCert(response);
    };


    /**
    * Returns the certificate with the specified label, and decrypts it if necessary using the specified password,
    * or returns null if the certificate is encrypted and the password is incorrect. 
    * 
    * Supported Platforms: Windows Mobile and BlackBerry
    * 
    * @param label label of the desired certificate
    * @param password Access password for the private key of the certificate. Pass null unless the platform requires a password. 
    */
    CertificateStore.prototype.getSignedCertificate = function(label, password) {
        var response = "";

        if (isWindowsMobile()) {
            var xmlHttpReq = getXMLHTTPRequest();
            xmlHttpReq.open("GET", "/sup.amp?querytype=certificatestore&version=2.1.3&command=getSignedCertificate" +
					"&label=" + encodeURIComponent(label), false);
            xmlHttpReq.send("");

            response = xmlHttpReq.responseText;
        }
        else if (isBlackBerry()) {
            response = _WorkflowContainer.getSignedCertificate(label);
        }
        else {
            throw "Not supported on this platform";
        }

        return createCert(response);
    };

    /**
    * Returns a list of full path names for the certificate files found in the 
    * file system for import.
    * 
    * Supported Platforms: Android
    * 
    * @param sFolder Folder in which to search for files.  This should be a full
    *        absolute path, based on the root of the device file system.  The 
    *        separator may be either "/" or "\".   For example, "\sdcard\mycerts"
    *        or "/sdcard/mycerts" is acceptable.   Do not include any http 
    *        prefixes, such as "file:".   
    * @param sFileExtension File extension to which the list should be 
    *        restricted.  Pass the string expected after the "." in the file 
    *        name.  For example, to match *.p12, pass "p12" as the argument.  
    *        Pass null to return all files in the folder.
    * @return A list of Strings, each String being the full path name of a 
    *         matched file in the given folder.
    */
    CertificateStore.prototype.listAvailableCertificatesFromFileSystem = function(sFolder, sFileExtension) {
        var response = "";

        if (isAndroid()) {
            response = _WorkflowContainer.listAvailableCertificatesFromFileSystem(sFolder, sFileExtension);
        }
        else {
            throw "Not supported on this platform";
        }

        return eval('(' + response + ')');
    }

    /**
    * Gets a certificate from a file
    * 
    * Supported Platforms: Android
    * 
    * @param filePath The absolute path to the file.
    * @param password The password needed to access the certificate's private data.
    */
    CertificateStore.prototype.getSignedCertificateFromFile = function(filePath, password) {
        var response = "";

        if (isAndroid()) {
            response = _WorkflowContainer.getSignedCertificateFromFile(filePath, password);
        }
        else if (isIOS()) {
            var xmlHttpReq = getXMLHTTPRequest();
            xmlHttpReq.open("GET", "/sup.amp?querytype=certificatestore&version=2.1.3&command=getSignedCertificateFromFile" +
					"&filePath=" + encodeURIComponent(filePath) + "&password=" + encodeURIComponent(password), false);
            xmlHttpReq.send("");

            response = xmlHttpReq.responseText;
        }
        else {
            throw "Not supported on this platform";
        }

        return createCert(response);
    };


    /**
    * Gets a certificate from the server.
    * 
    * Supported Platforms: iOS
    * 
    * @param username The username for the Windows user (in the form "DOMAIN\\username")
    * @param serverPassword The password for the Windows user
    * @param certPassword The password needed to access the certificate (may be the same or different from the Windows password)
    */
    CertificateStore.prototype.getSignedCertificateFromServer = function(username, serverPassword, certPassword) {
        var response = "";

        if (isIOS()) {
            var xmlHttpReq = getXMLHTTPRequest();
            xmlHttpReq.open("GET", "/sup.amp?querytype=certificatestore&version=2.1.3&command=getSignedCertificateFromServer" +
					"&username=" + encodeURIComponent(username) + "&serverPassword=" + encodeURIComponent(serverPassword) +
					"&certPassword=" + encodeURIComponent(certPassword), false);
            xmlHttpReq.send("");

            response = xmlHttpReq.responseText;
        }
        else {
            throw "Not supported on this platform";
        }

        return eval('(' + response + ')');
    };

    /**
    * Gets a certificate from the Afaria server.
    * 
    * Supported Platforms: iOS, Android & BlackBerry
    * 
    * @param  * commonName = Common name used to generate the certificate by Afaria
    * @param challengeCode = Challenge code for the user so that CA can verify and sign it
    * @return JSON object with CertBlob in Base64 encoded format and other information about certificate
    */
    CertificateStore.prototype.getSignedCertificateFromAfaria = function(commonName, challengeCode) {
        var response = "";

        if (isIOS()) {
            var xmlHttpReq = getXMLHTTPRequest();
            xmlHttpReq.open("GET", "/sup.amp?querytype=certificatestore&version=2.1&command=getSignedCertificateFromAfaria" +
					"&commonname=" + encodeURIComponent(commonName) + "&challengecode=" + encodeURIComponent(challengeCode) , false);
            xmlHttpReq.send("");

            response = xmlHttpReq.responseText;
        }
        else if (isAndroid() || isBlackBerry()) {
			response = _WorkflowContainer.getSignedCertificateFromAfaria(commonName, challengeCode);
        }
        else {
            throw "Not supported on this platform";
        }

        return eval('(' + response + ')');
    };
} ());
