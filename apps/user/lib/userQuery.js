/*jslint node: true */
'use strict';
var log = require( global.config.apps.LOGGING ).LOG;

exports.checkDisplayName = function ( displayName, next ) {
    require( global.config.apps.CLOUD ).Cloud.findByName( { name: displayName.toLowerCase() }, next );
};
