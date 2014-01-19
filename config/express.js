/*jslint node: true */
'use strict';

var express = require('express');
var engine = require('ejs-locals');
var flash = require('connect-flash');
var helpers = require('view-helpers');
var fs = require('fs');
var log4js = require('log4js');
var config = require('./config');


module.exports = function (app, passport) {

    var expressLogFile = fs.createWriteStream(config.root + '/logs/express.log', {flags: 'a'});

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
        //  app.use(log4js.connectLogger(logger, { level: 'auto' }));
        app.use(express.logger({stream: expressLogFile}));
    }

    app.configure(function () {
        app.set('title', config.app.name);
        app.set('port', config.port);
        app.set('views', config.root + '/views');
        app.set('uploads', config.root + '/uploads');
        app.engine('html', engine);
        app.set('view engine', 'html');
        app.use(express.favicon());
        app.use(require('less-middleware')({ src: config.root + '/public' }));
        app.use(express.static(config.root + '/public'));
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.methodOverride());
        app.use(express.cookieParser('f0of09m5s3ssi0n'));
        app.use(express.session({ secret: 'f0of09m5s3ssi0n' }));
        app.use(flash());
        app.use(helpers(config.app.name));
        app.use(passport.initialize());
        app.use(passport.session());
    });

    // development only
    app.configure('development', function () {
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
        console.error(err.stack);

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
