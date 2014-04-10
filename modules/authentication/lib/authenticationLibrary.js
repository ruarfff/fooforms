/*jslint node: true */
'use strict';
var path = require( 'path' );
var viewDir = path.join( global.config.modules.AUTHENTICATION, 'views' );
var loginPath = path.join( viewDir, 'login' );
var signupPath = path.join( viewDir, 'signup' );
var authenticator = require( './authenticator' );

module.exports = {
    loginPath: loginPath,
    signupPath: signupPath,
    ensureAuthenticated: authenticator.ensureAuthenticated,
    ensureAdmin: authenticator.ensureAdmin,
    ensureLoggedIn: authenticator.ensureLoggedIn
};
