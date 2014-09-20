/*jslint node: true */
'use strict';

var path = require('path');

var viewDir = path.join(global.config.modules.FORMBUILDER, 'views');


var routes = function (app, passport) {

    app.get('/partials/formBuilder', passport.authenticate('basic', { session: false }), function (req, res) {
        res.render(viewDir + '/index', {
            user: req.user
        });
    });

};

module.exports = routes;
