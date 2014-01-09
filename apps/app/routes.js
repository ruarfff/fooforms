/*jslint node: true */
'use strict';

var config = require( '../../config/config' );
var viewDir = config.root + '/apps/app/views';
var authentication = require( '../authentication/lib' );


var routes = function ( app ) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/

    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get( '/apps', authentication.ensureAuthenticated, function ( req, res ) {


    } );

};

module.exports = routes;
