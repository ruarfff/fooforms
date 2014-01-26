/*jslint node: true */
'use strict';

var path = require( 'path' );
var viewDir = path.join( global.config.apps.DATABASE, 'views' );
var database = require( global.config.apps.DATABASE );
var authLib = require( global.config.apps.AUTHENTICATION );

var routes = function ( app ) {

    // TODO: Move this to admin app
    app.get( '/admin/database', authLib.ensureAdmin, function ( req, res ) {

        database.connection.db.collectionNames( function ( err, names ) {
            res.render( viewDir + '/viewer', {
                error: err,
                collections: names
            } );
        } );
    } );

};

module.exports = routes;
