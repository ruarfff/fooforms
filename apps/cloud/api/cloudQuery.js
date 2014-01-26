/*jslint node: true */
'use strict';

var log = require( global.config.apps.LOGGING ).LOG;
var Cloud = require( global.config.apps.CLOUD ).Cloud;

exports.getCloudById = function ( req, res, id ) {
    try {
        Cloud.findById( id, function ( err, cloud ) {
            if ( err ) {
                log.error( err.toString() );
                res.status( 404 );
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

exports.getUserClouds = function ( req, res ) {
    try {
        Cloud.find( { owner: req.user.id }, function ( err, clouds ) {
            if ( err ) {
                log.error( err.toString() );
                res.status( 404 );
                res.send( err );
            } else {
                res.status( 200 );
                res.send( clouds );
            }
        } );
    } catch ( err ) {
        log.error( err.toString() );
        res.status( 500 );
        res.send( err );
    }
};
