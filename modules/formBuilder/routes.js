/*jslint node: true */
'use strict';

var path = require('path');

var viewDir = path.join(global.config.modules.FORMBUILDER, 'views');
var authentication = require(global.config.modules.AUTHENTICATION);


var routes = function (app, passport) {

    app.get('/partials/formBuilder', passport.authenticate('basic', { session: false }), function (req, res) {
        var find = '/';

        res.render(viewDir + '/index', {
            user: req.user
        });
    });

};

module.exports = routes;
