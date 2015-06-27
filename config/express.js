/*jslint node: true */
'use strict';

var engine = require('ejs');
//var flash = require('connect-flash');
var helpers = require('view-helpers');
var express = require('express');
var paginate = require('express-paginate');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
//var session = require('express-session');
var methodOverride = require('method-override')();
var logger = require('fooforms-logging').expressLogger;
var appRoot = require('app-root-path');
var cors = require('cors');

var errorHandler;
var compress = require('compression')({
    filter: function (req, res) {
        return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 9
});

var env = process.env.NODE_ENV || 'development';
if (env === 'development' || env === 'staging') {
    errorHandler = require('errorhandler')({dumpExceptions: true, showStack: true});
} else {
    errorHandler = require('errorhandler')();
}


module.exports = function (app, passport) {
    app.set('showStackError', true);
    //Should be placed before express.static
    app.use(compress);
    app.use(cors());
    app.set('title', global.config.app.name);
    app.set('port', global.config.port);
    app.set('views', global.config.root + '/views');
    app.set('files', global.config.root + '/files');
    app.engine('.html', engine.__express);
    app.set('view engine', 'html');
    app.use(favicon(appRoot + '/public/assets/ico/favicon.ico'));
    app.use(express.static(appRoot + '/public'));
    // If dev mode, expose unprocessed js
    if (env === 'development') {
        app.use(express.static(appRoot + '/client'));
    }

    //Don't use logger for test env
    if (process.env.NODE_ENV !== 'test') {
        app.use(logger);
    }

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(require('connect-multiparty')());

    app.use(methodOverride);
    app.use(cookieParser('f0of09m5s3ssi0n'));
    app.use(helpers(global.config.app.name));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(errorHandler);


    var defaultLimit = 10;
    var maxLimit = 50;
    app.use(paginate.middleware(defaultLimit, maxLimit));

};
