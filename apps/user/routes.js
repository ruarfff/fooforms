/*jslint node: true */
'use strict';

var config = require('../../config/config');
var viewDir = config.root + '/apps/user/views';
var authentication = require( '../authentication/lib' );
var userApi = require( './api' );
var path = require( 'path' );


var routes = function (app) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/
    app.get( '/profile', authentication.ensureAuthenticated, function ( req, res ) {
        var user = req.profile;

        res.render( path.join( viewDir, 'profile' ), {
            title: user.name,
            user: user
        });

    } );

    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get( '/me', authentication.ensureAuthenticated, function ( req, res ) {
        userApi.me( req, res );
    } );

};

module.exports = routes;
