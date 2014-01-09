/*jslint node: true */
'use strict';

var config = require( '../../config/config' );
var viewDir = config.root + '/apps/cloud/views';
var authentication = require( '../authentication/lib' );


var routes = function ( app ) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/

    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get( '/clouds', authentication.ensureAuthenticated, function ( req, res ) {


    } );

};

module.exports = routes;
