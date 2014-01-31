/*jslint node: true */
'use strict';

var path = require( 'path' );
var viewDir = path.join( global.config.apps.DASHBOARD, 'views' );
var authLib = require( global.config.apps.AUTHENTICATION );

var routes = function ( app ) {

    app.get( '/dashboard', authLib.ensureAuthenticated, function ( req, res ) {
        res.render( viewDir + '/index', {
            user: req.user,
            title: 'Dashboard'
        } );
    } );

};

module.exports = routes;
