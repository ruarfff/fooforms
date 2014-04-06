/*jslint node: true */
'use strict';
var log = require( global.config.apps.LOGGING ).LOG;

exports.checkDisplayName = function ( displayName, next ) {
    require( '../models/user' ).User.findByDisplayName( displayName.toLowerCase(), next );
};

exports.checkEmail = function ( email, next ) {
    require( '../models/user' ).User.findUserByEmail( email, next );
};