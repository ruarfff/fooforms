/*jslint node: true */
'use strict';

var config = require( '../../config/config' );
var viewDir = config.root + '/apps/database/views';
var database = require( './lib' );
var authentication = require( '../authentication/lib' );

var routes = function ( app ) {

    app.get( '/admin/database', authentication.ensureAdmin, function ( req, res ) {

        database.connection.db.collectionNames( function ( err, names ) {
            res.render( viewDir + '/viewer', {
                error: err,
                collections: names
            } );
        } );
    } );

};

module.exports = routes;
