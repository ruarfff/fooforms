/*jslint node: true */

var Cloud = require('../models/cloud').Cloud;
var log = require( global.config.apps.LOGGING ).LOG;

exports.createCloud = function ( cloudJSON, next ) {
    "use strict";
    try {
        log.debug(JSON.stringify(cloudJSON));
        var cloud = new Cloud( cloudJSON );
        cloud.save( function ( err ) {
            next( err, cloud );
        } );
    } catch ( err ) {
        log.error( err.toString() );
        next( err, null );
    }

};
