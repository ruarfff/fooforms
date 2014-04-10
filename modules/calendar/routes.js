/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.modules.CALENDAR, 'views');
var authenticator = require(global.config.modules.AUTHENTICATION);


var routes = function (app, passport) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/
    app.get('/partials/calendar', authenticator.ensureLoggedIn, function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'index'), {
            user: user
        });

    });
    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get('/api/calendar', authenticator.ensureLoggedIn, function (req, res) {


    });

};

module.exports = routes;
