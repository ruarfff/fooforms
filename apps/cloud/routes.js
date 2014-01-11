/*jslint node: true */
'use strict';

var config = require( '../../config/config' );
var viewDir = config.root + '/apps/cloud/views';
var authentication = require( '../authentication/lib' );
var path = require( 'path' );


var routes = function ( app ) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/
    app.get( '/clouds', authentication.ensureAuthenticated, function ( req, res ) {
        var user = req.profile;

        res.render( path.join( viewDir, 'index' ), {
            user: user
        } );

    } );
    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get( '/api/clouds', authentication.ensureAuthenticated, function ( req, res ) {


    } );

};

module.exports = routes;
