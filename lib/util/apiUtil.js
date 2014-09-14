/*jslint node: true */
'use strict';
var log = require('fooforms-logging');

/**
 * A utility method for handling errors in API calls.
 *
 * @param res - the response to send he error
 * @param err - The error object. Can be a message.
 * @param file - The file where the error occurred
 */
var handleError = function (res, err, file) {
    try {
        var responseCode = 500;
        if(err) {
            log.error(file , '-', err);
            if(err.http_code){
                responseCode = err.http_code;
            }
        }
        res.status(responseCode);
        res.send(err);
    } catch (err) {
        log.error(__filename, ' - ', err);
        res.send(500);
    }
};

/**
 * Escapes Regex characters from text
 *
 * @param text
 * @returns {*|XML|string|ng.ILocationService|void}
 */
function escapeRegExpChars(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = {
  handleError: handleError,
    escapeRegExpChars: escapeRegExpChars
};
