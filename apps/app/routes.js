/*jslint node: true */
'use strict';

var config = require('../../config/config');
var viewDir = config.root + '/apps/app/views';
var authenticator = require('../authentication/lib/authenticator');
var path = require('path');

var routes = function (app) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/
    app.get('/apps', authenticator.ensureAuthenticated, function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'index'), {
            user: user
        });

    });
    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get('/api/apps', authenticator.ensureAuthenticated, function (req, res) {


    });

};

module.exports = routes;
