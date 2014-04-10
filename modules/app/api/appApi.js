/*jslint node: true */
'use strict';
var appLib = require(global.config.modules.APP);
var apiUtil = require(global.config.modules.APIUTIL);
var appErrors = require('../lib/appErrors');
var log = require(global.config.modules.LOGGING).LOG;


/**
 * Create a brand new app
 *
 * @param req
 * @param res
 */
var createApp = function (req, res) {
    try {
        log.debug('creating app');
        var app = req.body;
        app.owner = req.user.id;
        appLib.createApp(app, function (err, app) {
            if (err) {
                if (err.code === 11000) {
                    err.data = 'An app with that label already exists.';
                    app.http_code = 409;
                }
                apiUtil.handleError(res, err);
            } else {
                res.status(200);
                res.send(app);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 * Get all apps owned by a user
 * @param req
 * @param res
 */
var getUserApps = function (req, res) {
    try {
        appLib.getAppsByUserId(req.user.id, function (err, apps) {
            if(!apps && !err) {
                err = appErrors.appNotFoundError;
            }
            if (err) {
                apiUtil.handleError(res, err);
            } else {
                res.status(200);
                res.send(apps);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 *
 * @param id
 * @param res
 */
var getAppById = function (id, res) {
    try {
        appLib.getAppById(id, function (err, app) {
            if (!err && !app) {
                err = appErrors.appNotFoundError;
            }
            if(err){
                apiUtil.handleError(res, err);
            } else {
                res.status(200);
                res.send(app);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 * Updates an app without affecting dynamic data like Posts.
 *
 * @param req
 * @param res
 */
var updateApp = function (req, res) {
    try {
        appLib.updateApp(req.body, function (err, app) {
            if (!err && !app) {
                err = appErrors.appNotFoundError;
            }
            if(err) {
                apiUtil.handleError(res, err);
            } else {
                res.status(200);
                res.send(app);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 * Remove an app and all posts in it.
 *
 * @param req
 * @param res
 */
var deleteApp = function (req, res) {
    try {
        var id = req.body._id;
        appLib.deleteAppById(id, function (err) {
            if (err) {
                apiUtil.handleError(res, err);
            } else {
                res.send(200);
            }
        });

    } catch (err) {
        apiUtil.handleError(res, err);
    }
};


module.exports = {
    create: createApp,
    getUserApps: getUserApps,
    getAppById: getAppById,
    update: updateApp,
    delete: deleteApp
};


