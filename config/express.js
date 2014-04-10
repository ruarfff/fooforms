/*jslint node: true */
'use strict';

var express = require('express');
var engine = require('ejs');
var flash = require('connect-flash');
var helpers = require('view-helpers');
var log4js = require('log4js');
var log = require(global.config.modules.LOGGING).LOG;


module.exports = function (app, passport) {

    app.set('showStackError', true);
    //Should be placed before express.static
    app.use(express.compress({
        filter: function (req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    //Don't use logger for test env
    if (process.env.NODE_ENV !== 'test') {
        app.use(log4js.connectLogger(log, { level: 'auto' }));
    }

    app.configure(function () {
        app.set('title', global.config.app.name);
        app.set('port', global.config.port);
        app.set('views', global.config.root + '/frontend/views');
        app.set('files', global.config.root + '/files');
        app.engine('.html', engine.__express);
        app.set('view engine', 'html');
        app.use(express.favicon(global.config.root + '/frontend/public/assets/ico/favicon.ico'));
        app.use(express.static(global.config.root + '/frontend/public'));
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.methodOverride());
        app.use(express.cookieParser('f0of09m5s3ssi0n'));
        app.use(express.session({ secret: 'f0of09m5s3ssi0n' }));
        app.use(flash());
        app.use(helpers(global.config.app.name));
        app.use(passport.initialize());
        app.use(passport.session());
    });

    // development only
    app.configure('development', function () {
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    // staging only
    app.configure('staging', function () {
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    // production only
    app.configure('production', function () {
        app.use(express.errorHandler());
    });

    app.use(app.router);

    app.use(function (err, req, res, next) {
        //Treat as 404
        if (err.message.indexOf('not found')) {
            return next();
        }

        //Log it
        log.error(err.stack);

        //Error page
        res.status(500).render('500', {
            error: err.stack
        });
    });

    //Assume 404 since no middleware responded
    app.use(function (req, res) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });

};
