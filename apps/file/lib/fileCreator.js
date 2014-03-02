/*jslint node: true */

var File = require('../models/file').File;
var log = require( global.config.apps.LOGGING ).LOG;

exports.createFile = function ( fileJSON, next ) {
    "use strict";
    try {
        log.debug(JSON.stringify(fileJSON));
        var file = new File( fileJSON );
        file.save( function ( err ) {
            next( err, file );
        } );
    } catch ( err ) {
        log.error( err.toString() );
        next( err, null );
    }

};
