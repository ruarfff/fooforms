/*jslint node: true */
'use strict';

var config = require( '../../config/config' );
var viewDir = config.root + '/apps/app/views';
var authentication = require( '../authentication/lib' );
var path = require( 'path' );

var routes = function ( app ) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/
    app.get( '/apps', authentication.ensureAuthenticated, function ( req, res ) {

        res.render( path.join( viewDir, '/index' ), {
            user: req.user
        } );

    } );
    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get( '/api/apps', authentication.ensureAuthenticated, function ( req, res ) {


    } );

};

module.exports = routes;
