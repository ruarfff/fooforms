/*jslint node: true */
'use strict';

var cloudLib = require( global.config.apps.CLOUD );
var Cloud = require( '../models/cloud' ).Cloud;
var log = require( global.config.apps.LOGGING ).LOG;

exports.update = function ( req, res ) {
    try {
        var updatedCloud = req.body;
        log.debug(JSON.stringify(updatedCloud));
        var query = { _id: updatedCloud.id };

        cloudLib.Cloud.findOneAndUpdate( query, updatedCloud, {upsert: false, "new": false} ).exec(
            function ( err, cloud ) {
                if ( !err ) {
                    log.debug("updated " + cloud.name);
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

exports.delete = function (req, res) {
    try {
        var cloudToRemove = new Cloud( req.body );
        log.debug( JSON.stringify( cloudToRemove ) );
        cloudToRemove.remove( function ( err, cloud ) {
            log.debug( JSON.stringify( err ) );
            log.debug( JSON.stringify( cloud ) );
            if (err) {
                log.error(err.toString());
                res.status(400);
                res.send(err);
            } else {
                res.status(200);
            }
        });

    } catch (err) {
        log.error(err.toString());
        res.status(500);
        res.send(err);
    }
};
