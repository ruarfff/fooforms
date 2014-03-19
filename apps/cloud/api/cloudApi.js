/*jslint node: true */
'use strict';
var cloudLib = require(global.config.apps.CLOUD);
var log = require(global.config.apps.LOGGING).LOG;


/**
 * Create new cloud
 */
var createCloud = function (req, res) {
    try {
        log.debug('creating cloud');
        var body = req.body;
        var cloudDetails = {
            name: body.name,
            description: body.description || '',
            icon: body.icon || '',
            menuLabel: body.menuLabel || '',
            owner: req.user.id
        };
        log.debug(JSON.stringify(cloudDetails));
        cloudLib.createCloud(cloudDetails, function (err, cloud) {
            if (err) {
                var responseCode = 500;
                if (err.code === 11000) {
                    err.data = 'A cloud with that label already exists.';
                    responseCode = 409;
                }
                handleError(res, err, responseCode);
            } else {
                res.status(200);
                res.send(cloud);
            }
        });
    } catch (err) {
        handleError(res, err, 500);
    }
};


var getCloudById = function (req, res, id) {
    try {
        cloudLib.getCloudById(id, function (err, cloud) {
            if (err || !cloud) {
                handleError(res, err, 404);
            } else {
                res.status(200);
                res.send(cloud);
            }
        });
    } catch (err) {
        handleError(res, err, 500);
    }
};

var getUserClouds = function (req, res) {
    try {
        cloudLib.getUserClouds(req.user.id, function (err, clouds) {
            if (err || !clouds) {
                handleError(res, err, 404);
            } else {
                res.status(200);
                res.send(clouds);
            }
        });
    } catch (err) {
        handleError(res, err, 500);
    }
};

// Temporary helper function
var getAllClouds = function (req, res) {
    try {
        cloudLib.getAllClouds(function (err, clouds) {
            if (err || !clouds) {
                handleError(res, err, 404);
            } else {
                res.status(200);
                res.send(clouds);
            }
        });
    } catch (err) {
        handleError(res, err, 500);
    }
};

var updateCloud = function (req, res) {
    try {
        cloudLib.updateCloud(req.body, function (err, cloud) {
            if (err || !cloud) {
                handleError(res, err, 409);
            } else {
                res.status(200);
                res.send(cloud);
            }
        });
    } catch (err) {
        handleError(res, err, 500);
    }
};

var deleteCloud = function (req, res) {
    try {
        var id = req.body._id;
        cloudLib.deleteCloudById(id, function (err, cloud) {
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

var addAppToCloud = function (cloudId, appId, req, res) {
    try {
        cloudLib.addAppToCloud(cloudId, appId, function (err, cloud) {
            if (err || !cloud) {
                handleError(res, err, 409);
            } else {
                res.status(200);
                res.send(cloud);
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
        log.error(err.toString());
        res.status(responseCode);
        res.send(err);
    } catch (err) {
        log.error(err);
        res.send(500);
    }
};


module.exports = {
    create: createCloud,
    getCloudById: getCloudById,
    getUserClouds: getUserClouds,
    getAllClouds: getAllClouds,
    update: updateCloud,
    delete: deleteCloud,
    addAppToCLoud: addAppToCloud
};





