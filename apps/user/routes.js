/*jslint node: true */
'use strict';

var config = require('../../config/config');
var viewDir = config.root + '/apps/user/views';



var routes = function (app) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/

    app.get('users/', function (req, res) {
        res.render(viewDir + '/index');
    });

    /*********************************************************************************
     *  API
     *********************************************************************************/

};

module.exports = routes;
