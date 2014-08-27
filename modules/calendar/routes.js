/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.modules.CALENDAR, 'views');
var authenticator = require(global.config.modules.AUTHENTICATION);


var routes = function (app, passport) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/
    app.get('/partials/calendar', passport.authenticate('basic', { session: false }), function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'index'), {
            user: user
        });

    });
    /*********************************************************************************
     *  API
     *********************************************************************************/

};

module.exports = routes;
