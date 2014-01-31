/*jslint node: true */
'use strict';
var User = require( '../models/user' ).User;
var log = require( global.config.apps.LOGGING ).LOG;

exports.checkDisplayName = function ( displayName, next ) {
    log.debug( 'Checking is username ' + displayName + ' already exists' );
    User.find( { displayName: displayName }, next );
};
