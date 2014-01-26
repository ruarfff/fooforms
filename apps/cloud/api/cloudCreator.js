/*jslint node: true */
'use strict';

var cloudLib = require( global.config.apps.CLOUD );
var log = require( global.config.apps.LOGGING ).LOG;

/**
 * Create new user
 */
exports.create = function ( req, res ) {
    try {
        var body = req.body;
        var cloudDetails = {
            name: body.name,
            description: body.description,
            icon: body.icon,
            menuLabel: body.menuLabel,
            owner: req.user.id
        };

        cloudLib.createCloud( cloudDetails, function ( err, cloud ) {
            if ( err ) {
                log.error( err.toString() );
                res.status( 500 );
                res.send( err );
            } else {
                res.status( 200 );
                res.send( cloud );
            }
        } );

    } catch ( err ) {
        log.error( err.toString() );
        res.status( 500 );
        res.send( err );
    }
};
