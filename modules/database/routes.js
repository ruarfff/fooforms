/*jslint node: true */
'use strict';

var path = require( 'path' );
var viewDir = path.join( global.config.modules.DATABASE, 'views' );
var database = require( global.config.modules.DATABASE );
var authLib = require( global.config.modules.AUTHENTICATION );

var routes = function ( app, passport ) {

    // TODO: Move this to admin app
    app.get( '/admin/database', passport.authenticate('basic', { session: false }), function ( req, res ) {

        database.connection.db.collectionNames( function ( err, names ) {
            res.render( viewDir + '/viewer', {
                error: err,
                collections: names
            } );
        } );
    } );

};

module.exports = routes;
