/*jslint node: true */
'use strict';

var config = require( '../../config/config' );
var viewDir = config.root + '/apps/user/views';
var authentication = require( '../authentication/lib' );
var userApi = require( './api' );
var path = require( 'path' );

var routes = function ( app ) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/

    app.get( '/profile', authentication.ensureAuthenticated, function ( req, res ) {
        var user = req.user;

        res.render( path.join( viewDir, '/profile' ), {
            user: user
        } );

    } );

    app.get( '/people', authentication.ensureAuthenticated, function ( req, res ) {
        var user = req.user;

        res.render( path.join( viewDir, 'people' ), {
            user: user
        } );

    } );

    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get( '/api/user/me', authentication.ensureAuthenticated, function ( req, res ) {
        userApi.me( req, res );
    } );

};

module.exports = routes;
