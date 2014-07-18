/*jslint node: true */
'use strict';

var authenticator = require(global.config.modules.AUTHENTICATION);
var dev = (process.env.NODE_ENV === 'development');
var log = require(global.config.modules.LOGGING).LOG;

/**
 * Main configuration for all routes in application.
 * Any forms that are added should initialize their routes here.
 *
 * @param app - The express object
 * @param passport - Passport object for authenticator
 */
var routes = function (app, passport) {

    /**app.route('/')
        .get(function (req, res) {
            res.render('index', {
                title: global.config.app.name,
                dev: dev
            });
        });
    */
    app.route('/dashboard')
        .get(function (req, res) {
            res.render('dashboard', {
                dev: dev,
                user: req.user || ''
            });
        });

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
        .get(passport.authenticate( 'basic', {session: false, failureRedirect:'/login'} ), function (req, res) {
            res.render('userGuide');
        });

    app.route('/partials/settings')
        .get(passport.authenticate( 'basic', {session: false, failureRedirect:'/login'} ), function (req, res) {
            res.render('settings');
        });

    app.route('/404')
        .get(function (req, res) {
            res.status(404).render('404', {
                url: req.originalUrl,
                error: 'Not found'
            });
        });


    app.route('/:username')
        .get(passport.authenticate( 'basic', {session: false, failureRedirect:'/login'} ), function (req, res, next) {
            var username = req.params.username;

            require(global.config.modules.USER).findByDisplayName(username, function (err, user) {

                if (!err || !user) {
                    err = new Error('User with name: ' + username + ' - not found.');
                    err.http_code = 404;
                    return next();
                }

                log.debug(__filename + ' - ', 'rendering dashboard for user ' + username);
                return res.render('dashboard', {
                    dev: dev,
                    user: req.user
                });

            });
        });
    app.route('/:username/:folder')
        .get(passport.authenticate( 'basic', {session: false, failureRedirect:'/login'} ), function (req, res, next) {
            var username = req.params.username;
            var folderName = req.params.folder;

            var folderLib = require(global.config.modules.FOLDER);
            var userLib = require(global.config.modules.USER);

            require(global.config.modules.USER).findByDisplayName(username, function (err, user) {

                if (!err || !user) {
                    err = new Error('User with name: ' + username + ' - not found.');
                    err.http_code = 404;
                    return next();
                }

                folderLib.getFolderByName(folderName, function (err, folder) {
                    if (err || !folder || (folder.owner !== user._id)) {
                        res.status(404).render('404', {
                            url: req.originalUrl,
                            error: 'Not found'
                        });
                    } else {
                        res.render('dashboard', {
                            dev: dev,
                            user: req.user
                        });
                    }
                });

            });

        });

    app.route('/:username/:folder/:form')
        .get(passport.authenticate( 'basic', {session: false, failureRedirect:'/login'} ), function (req, res, next) {
            next();
        });

    app.route('*')
        .get(function (req, res) {
            res.render('dashboard', {
                dev: dev,
                user: req.user || ''
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
