/*jslint node: true */
'use strict';

var engine = require('ejs');
var flash = require('connect-flash');
var helpers = require('view-helpers');
var log4js = require('log4js');
var log = require(global.config.modules.LOGGING).LOG;


var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('static-favicon');
var session = require('express-session');
var methodOverride = require('method-override')();
var errorHandler;
var compress = require('compression')({
    filter: function (req, res) {
        return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 9
});

var env = process.env.NODE_ENV || 'development';
if (env === 'development' || env === 'staging') {
    errorHandler = require('errorhandler')({ dumpExceptions: true, showStack: true });
} else {
    errorHandler = require('errorhandler')();
}


module.exports = function (app, passport) {
    app.set('showStackError', true);
    //Should be placed before express.static
    app.use(compress);
    app.set('title', global.config.app.name);
    app.set('port', global.config.port);
    app.set('views', global.config.root + '/frontend/views');
    app.set('files', global.config.root + '/files');
    app.engine('.html', engine.__express);
    app.set('view engine', 'html');
    app.use(favicon(global.config.root + '/frontend/public/assets/ico/favicon.ico'));
    app.use(express.static(global.config.root + '/frontend/public'));
    //Don't use logger for test env
    if (process.env.NODE_ENV !== 'test') {
        app.use(log4js.connectLogger(log, { level: 'auto' }));
    }

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(require('connect-multiparty')());

    app.use(methodOverride);
    app.use(cookieParser('f0of09m5s3ssi0n'));
    app.use(session({secret: 'f0of09m5s3ssi0n',
        saveUninitialized: true,
        resave: true}));
    app.use(flash());
    app.use(helpers(global.config.app.name));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(errorHandler);

};
