/*jslint node: true */
'use strict';

var log = require('fooforms-logging').LOG;
var rootUrls = require('./rootUrls');
var assets = require('./assets');


var admin = require('../modules/admin');
var calendar = require('../modules/calendar');
var dashboard = require('../modules/dashboard');
var file = require('../modules/file');
var formBuilder = require('../modules/formBuilder');
var form = require('../modules/forms');
var formViewer = require('../modules/formViewer');
var membership = require('../modules/membership');
var site = require('../modules/site');






/**
 * Main configuration for all routes in application.
 * Any forms that are added should initialize their routes here.
 *
 * @param app - The express object
 * @param passport - Passport object for authenticator
 */
var routes = function (app, passport) {
    var slash = '/';
    var api = '/api';


    /**
     * Public routes i.e. don't require authentication
     */

    app.use(slash, site.siteViewRoutes);
    app.use(slash + rootUrls.signup, membership.signupRoutes);
    app.use(slash + rootUrls.login, membership.loginRoutes);
    // For the dashboard, authentication is handled on the client by not fetching or showing anything until user is checked.
    app.use(slash + rootUrls.dashboard, dashboard.dashboardViewRoutes);


    /**
     * Some basic view routes that wont's bother authenticating since they have no data in them
     */
    app.use(slash + rootUrls.users, membership.userViewRoutes);
    app.use(slash + rootUrls.organisations, membership.organisationViewRoutes);
    app.use(slash + rootUrls.teams, membership.teamViewRoutes);
    app.use(slash + rootUrls.files, file.fileViewRoutes);


    // If someone hits a root URL directly (not from dashboard) redirect them to the dashboard
    for(var rootUrl in rootUrls) {
        app.route(slash + rootUrl)
            .get(function (req, res) {
                return res.render(dashboard.mainView, {
                    dev: (process.env.NODE_ENV === 'development'),
                    user: req.user || '',
                    assets: assets
                });
            });
    }


    /**
     * API and other routes that are protected
     */
    app.use(api + slash + rootUrls.dashboard, passport.authenticate( 'basic', {session: false} ), dashboard.dashboardApiRoutes);
    app.use(api + slash + rootUrls.users, passport.authenticate( 'basic', {session: false} ), membership.userApiRoutes);
    app.use(api + slash + rootUrls.organisations, passport.authenticate( 'basic', {session: false} ), membership.organisationApiRoutes);
    app.use(api + slash + rootUrls.teams, passport.authenticate( 'basic', {session: false} ), membership.teamApiRoutes);
    app.use(api + slash + rootUrls.forms, passport.authenticate( 'basic', {session: false} ), form.formRoutes);
    app.use(api + slash + rootUrls.posts, passport.authenticate( 'basic', {session: false} ), form.postRoutes);
    app.use(api + slash + rootUrls.comments, passport.authenticate( 'basic', {session: false} ), form.commentRoutes);
    app.use(api + slash + rootUrls.files, passport.authenticate( 'basic', {session: false} ), file.fileApiRoutes);

    app.use(slash + rootUrls.admin, passport.authenticate( 'basic', {session: false} ), admin.adminViewRoutes);
    app.use(slash + rootUrls.calendar, passport.authenticate( 'basic', {session: false} ), calendar.calendarViewRoutes);
    app.use(slash + rootUrls.forms, passport.authenticate( 'basic', {session: false} ), formBuilder.formBuilderViewRoutes);
    app.use(slash + rootUrls.forms, passport.authenticate( 'basic', {session: false} ), form.formViewRoutes);
    app.use(slash + rootUrls.forms, passport.authenticate( 'basic', {session: false} ), formViewer.formViewerViewRoutes);
    app.use(slash + rootUrls.formViewer, passport.authenticate( 'basic', {session: false} ), formViewer.formViewerApiRoutes);




    app.route('/404')
        .get(function (req, res) {
            res.status(404).render('404', {
                url: req.originalUrl,
                error: 'Not found'
            });
        });


    /**
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
                // TODO: Do something better here, show user profile?
                return res.redirect('/dashboard');

            });
        });

    app.route('/:username/:folder')
        .get(passport.authenticate( 'basic', {session: false, failureRedirect:'/login'} ), function (req, res, next) {
            var username = req.params.username;
            var folderName = req.params.folder;

            var folderLib = require(global.config.modules.FOLDER);

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
                        return res.redirect('/dashboard');
                    }
                });

            });

        });

    app.route('/:username/:folder/:form')
        .get(passport.authenticate( 'basic', {session: false, failureRedirect:'/login'} ), function (req, res, next) {
            next();
        });
*/

    app.route('/:username')
        .get(passport.authenticate( 'basic', {session: false, failureRedirect:'/dashboard'} ), function (req, res, next) {
            if(req.user.displayName === req.params.username) {
                res.send();
            } else {
                next();
            }
        });


    app.route('/:username/:form')
        .get(passport.authenticate( 'basic', {session: false, failureRedirect:'/dashboard'} ), function (req, res, next) {
            if(req.user.displayName === req.params.username) {
                res.send();
            } else {
                next();
            }
        });


    app.use(function (err, req, res, next) {
        if (err.message.indexOf('not found')) {
            //Treat as 404
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
