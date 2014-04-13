/*jslint node: true */
'use strict';

var authenticator = require(global.config.modules.AUTHENTICATION);
var dev = (process.env.NODE_ENV === 'development');
var log = require(global.config.modules.LOGGING).LOG;

/**
 * Main configuration for all routes in application.
 * Any forms that are added should initialize their routes here.
 * @param app - The express object
 * @param passport - Passport object for authenticator
 */
var routes = function (app, passport) {

    app.route('/')
        .get(function (req, res) {
            log.debug('rendering root');
            res.render('index', {
                title: global.config.app.title,
                dev: dev
            });
        });

    /**
     router.get('/:username', function (req, res, next) {
        if (req.params.username === 'hello') {
            res.send('Hello');
        } else {
            next();
        }
    });

     router.get('/:username/:folder', function (req, res, next) {
        var expected = 'hello/sir';
        if (req.params.username + '/' + req.params.folder === expected) {
            res.send('Hello Sir');
        } else {
            next();
        }
    });

     router.get('/:username/:folder/:form', function (req, res, next) {
        var expected = 'hello/sir/evening';
        if (req.params.username + '/' + req.params.folder + '/' + req.params.form === expected) {
            res.send('Hello sir, good evening.');
        } else {
            next();
        }
    });
     */
    require('../modules/admin/routes')(app, passport);
    require('../modules/authentication/routes')(app, passport);
    require('../modules/dashboard/routes')(app, passport);
    require('../modules/calendar/routes')(app, passport);
    require('../modules/database/routes')(app, passport);
    require('../modules/user/routes')(app, passport);
    require('../modules/folder/routes')(app, passport);
    require('../modules/form/routes')(app, passport);
    require('../modules/formBuilder/routes')(app, passport);
    require('../modules/formViewer/routes')(app, passport);
    require('../modules/file/routes')(app, passport);

    app.route('/partials/userGuide')
        .get(authenticator.ensureLoggedIn, function (req, res) {
            res.render('userGuide');
        });

    app.route('/partials/settings')
        .get(authenticator.ensureLoggedIn, function (req, res) {
            res.render('settings');
        });

    app.route('/404')
        .get(function (req, res) {
            res.status(404).render('404', {
                url: req.originalUrl,
                error: 'Not found'
            });
        });

    app.route('*')
        .get(authenticator.ensureAuthenticated, function (req, res) {
            res.render('dashboard', {
                dev: dev,
                user: req.user
            });
        });

    app.use(function (err, req, res, next) {
        //Treat as 404
        if (err.message.indexOf('not found')) {
            return next();
        }

        //Log it
        log.error(__filename, ' - ', err);

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

module.exports = routes;
