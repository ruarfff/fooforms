/*jslint node: true */
'use strict';

var cloudLib = require( global.config.apps.CLOUD );
var log = require( global.config.apps.LOGGING ).LOG;

exports.update = function ( req, res ) {
    try {
        var updatedCloud = req.body;

        var query = { _id: updatedCloud.id };

        cloudLib.Cloud.findOneAndUpdate( query, updatedCloud, {upsert: false, "new": false} ).exec(
            function ( err, cloud ) {
                if ( !err ) {
                    log.debug( "updated " + JSON.stringify( cloud ) );
                    res.status( 200 );
                    res.send( cloud );
                } else {
                    log.error( err.toString() );
                    res.status( 400 );
                    res.send( err );
                }
            } );
    } catch ( err ) {
        log.error( err.toString() );
        res.status( 500 );
        res.send( err );
    }
};
