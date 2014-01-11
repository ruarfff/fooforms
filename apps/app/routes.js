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
        var user = req.profile;

        res.render( path.join( viewDir, 'index' ), {
            user: user
        } );

    } );
    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get( '/api/apps', authentication.ensureAuthenticated, function ( req, res ) {


    } );

};

module.exports = routes;
