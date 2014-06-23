/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.modules.DASHBOARD, 'views');

var routes = function (app, passport) {

    app.get('/partials/dashboard', passport.authenticate('basic', { session: false }), function (req, res) {
        res.render(viewDir + '/index');
    });

};

module.exports = routes;
