/*jslint node: true */
'use strict';

var authenticator = require( './authenticator' );

module.exports = {
    ensureAuthenticated: authenticator.ensureAuthenticated,
    ensureAdmin: authenticator.ensureAdmin
};
