/*jslint node: true */
'use strict';

/**
 * Main configuration for all routes in application.
 * Any apps that are added should initialize their routes here.
 * @param app - The express object
 * @param passport - Passport object for authenticator
 */
var routes = function (app, passport) {

    app.get('/', function (req, res) {
        res.render('index');
    });

    require( '../apps/app/routes' )( app );
    require('../apps/authentication/routes')(app, passport);
    require( '../apps/cloud/routes' )( app );
    require( '../apps/dashboard/routes' )( app );
    require( '../apps/database/routes' )( app );
    require('../apps/dev/routes')(app);
    require('../apps/user/routes')(app);

};

module.exports = routes;
