/*jslint node: true */
'use strict';
var appLib = require(global.config.apps.APP);
var log = require(global.config.apps.LOGGING).LOG;


/**
 * Create new app
 */
var createApp = function (req, res) {
    try {
        log.debug('creating app');
        var app = req.body;
        app.owner = req.user.id;
        appLib.createApp(app, function (err, app) {
            if (err) {
                var responseCode = 500;
                if (err.code === 11000) {
                    err.data = 'An app with that label already exists.';
                    responseCode = 409;
                }
                handleError(res, err, responseCode);
            } else {
                res.status(200);
                res.send(app);
            }
        });
    } catch (err) {
        handleError(res, err, 500);
    }
};

var getUserApps = function (req, res) {
    try {
        appLib.getAppsByUserId(req.user.id, function (err, apps) {
            if (err || !apps) {
                handleError(res, err, 404);
            } else {
                res.status(200);
                res.send(apps);
            }
        });
    } catch (err) {
        handleError(res, err, 500);
    }
};

var getAppById = function (id, res) {
    try {
        appLib.getAppById(id, function (err, app) {
            if (err || !app) {
                handleError(res, err, 404);
            } else {
                res.status(200);
                res.send(app);
            }
        });
    } catch (err) {
        handleError(res, err, 500);
    }
};

var updateApp = function (req, res) {
    try {
        appLib.updateApp(req.body, function (err, app) {
            if (err || !app) {
                handleError(res, err, 409);
            } else {
                res.status(200);
                res.send(app);
            }
        });
    } catch (err) {

    }
};

var deleteApp = function (req, res) {
    try {
        var id = req.body._id;
        appLib.deleteAppById(id, function (err, app) {
            if (err) {
                handleError(res, err, 404);
            } else {
                res.send(200);
            }
        });

    } catch (err) {
        handleError(res, err, 500);
    }
};

/**
 * A private utility method for handling errors in API calls.
 * TODO: Move this to some kind of reusable utility file.
 * @param res - the response to send he error
 * @param err - The error object. Can be a message.
 * @param responseCode - The desired error response code. Defaults to 500 if empty.
 */
var handleError = function (res, err, responseCode) {
    try {
        if (!responseCode) {
            responseCode = 500;
        }
        if (err) {
            log.error(err.toString());
        }
        res.status(responseCode);
        res.send(err);
    } catch (err) {
        log.error(err);
        res.send(500);
    }
};


module.exports = {
    create: createApp,
    getUserApps: getUserApps,
    getAppById: getAppById,
    update: updateApp,
    delete: deleteApp
};





