/*jslint node: true */
'use strict';

var config = require( '../../config/config' );
var viewDir = config.root + '/apps/dev/views';
var db = require( '../database/lib' );
var authentication = require( '../authentication/lib' );

var routes = function ( app ) {

    app.get( '/admin', authentication.ensureAuthenticated, function ( req, res ) {
        var user = req.user;
        var find = '/';
        var re = new RegExp( find, 'g' );

        var cloudName = req.originalUrl.replace( re, '' );

        res.render( viewDir + '/index', {
            cloud: cloudName,
            isCloud: 'false',
            user: req.user
        } );
    } );

    app.get( '/admin/api', authentication.ensureAuthenticated, function ( req, res ) {
        res.render( viewDir + '/api' );
    } );

    app.get( '/admin/status', authentication.ensureAuthenticated, function ( req, res ) {
        res.render( viewDir + '/status',
            {
                title: config.app.name,
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
