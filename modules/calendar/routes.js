/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.modules.CALENDAR, 'views');


var routes = function (app, passport) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/
    app.get('/partials/calendar', function (req, res) {
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
