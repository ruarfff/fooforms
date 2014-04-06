/*jslint node: true */
'use strict';
var log = require(global.config.apps.LOGGING).LOG;

/**
 * A utility method for handling errors in API calls.
 *
 * @param res - the response to send he error
 * @param err - The error object. Can be a message.
 * @param responseCode - The desired error response code. Defaults to 500 if empty.
 */
var handleError = function (res, err, responseCode) {
    try {
        if(err) {
            log.error(err);
            if(!responseCode && err.http_code){
                responseCode = err.http_code;
            }
        }
        if (!responseCode) {
            responseCode = 500;
        }
        res.status(responseCode);
        res.send(err);
    } catch (err) {
        log.error(err);
        res.send(500);
    }
};


module.exports = {
  handleError: handleError
};