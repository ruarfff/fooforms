/*jslint node: true */
'use strict';

var path = require('path');

var viewDir = path.join(global.config.modules.SITE, 'views');


var routes = function (app, passport) {

    /*********************************************************************************
     *  View Handling
     *********************************************************************************/


    app.get('/', function (req, res) {
        res.render(viewDir + '/index');
    });

    app.get('/about', function (req, res) {
        res.render(viewDir + '/about');
    });

    app.get('/contact', function (req, res) {
        res.render(viewDir + '/contact');
    });

};


module.exports = routes;
