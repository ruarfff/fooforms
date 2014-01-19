/*jslint node: true */
'use strict';
var path = require( 'path' );
var viewDir = path.join( global.config.apps.ADMIN, 'views' );
var db = require( global.config.apps.DATABASE );
var authenticator = require( global.config.apps.AUTHENTICATION );

var routes = function ( app ) {

    app.get( '/admin', authenticator.ensureAuthenticated, function ( req, res ) {
        res.render( viewDir + '/index', {
            user: req.user,
            title: 'Admin'
        } );
    } );

    app.get( '/admin/api', authenticator.ensureAuthenticated, function ( req, res ) {
        res.render( viewDir + '/api' );
    } );

    app.get( '/admin/status', authenticator.ensureAuthenticated, function ( req, res ) {
        res.render( viewDir + '/status',
            {
                title: global.config.app.name,
                dbConnected: db.connected,
                dbErrorMessage: db.errorMessage || "No error message available",
                uptime: process.uptime(),
                arch: process.arch,
                platform: process.platform,
                nodeVersion: process.version
            }
        );
    } );
};

module.exports = routes;
