/*jslint node: true */
'use strict';

var config = require('../../config/config');
var viewDir = config.root + '/apps/database/views';
var database = require('./lib/databaseGateway');
var authenticator = require('../authentication/lib/authenticator');

var routes = function (app) {

    app.get('/admin/database', authenticator.ensureAdmin, function (req, res) {

        database.connection.db.collectionNames(function (err, names) {
            res.render(viewDir + '/viewer', {
                error: err,
                collections: names
            });
        });
    });

};

module.exports = routes;
