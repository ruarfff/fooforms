/*jslint node: true */
'use strict';
var cloudLib = require(global.config.modules.CLOUD);
var log = require(global.config.modules.LOGGING).LOG;
var apiUtil = require(global.config.modules.APIUTIL);


/**
 * Create new cloud
 */
var createCloud = function (req, res) {
    try {
        var body = req.body;
        var cloudDetails = {
            name: body.name,
            owner: req.user.id,
            menuLabel: body.menuLabel || '',
            description: body.description || '',
            icon: body.icon || '',
            isPrivate: body.isPrivate || false
        };
        cloudLib.createCloud(cloudDetails, function (err, cloud) {
            if (err) {
                if (err.code === 11000) {
                    err.data = 'A cloud with that label already exists.';
                    err.http_code = 409;
                }
                apiUtil.handleError(res, err);
            } else {
                res.status(200);
                res.send(cloud);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err, __filename);
    }
};


var getCloudById = function (req, res, id) {
    try {
        cloudLib.getCloudById(id, function (err, cloud) {
            if (err || !cloud) {
                apiUtil.handleError(res, err, 404);
            } else {
                res.status(200);
                res.send(cloud);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

var getUserClouds = function (req, res) {
    try {
        cloudLib.getUserClouds(req.user.id, function (err, clouds) {
            if (err || !clouds) {
                apiUtil.handleError(res, err, 404);
            } else {
                res.status(200);
                res.send(clouds);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

// Temporary helper function
var getAllClouds = function (req, res) {
    try {
        cloudLib.getAllClouds(function (err, clouds) {
            if (err || !clouds) {
                apiUtil.handleError(res, err, 404);
            } else {
                res.status(200);
                res.send(clouds);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

var updateCloud = function (req, res) {
    try {
        cloudLib.updateCloud(req.body, function (err, cloud) {
            if (err || !cloud) {
                apiUtil.handleError(res, err, 409);
            } else {
                res.status(200);
                res.send(cloud);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

var deleteCloud = function (req, res) {
    try {
        var id = req.body._id;
        cloudLib.deleteCloudById(id, function (err, cloud) {
            if (err) {
                apiUtil.handleError(res, err, 404);
            } else {
                res.send(200);
            }
        });

    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

var addFormToCloud = function (cloudId, formId, req, res) {
    try {
        cloudLib.addFormToCloud(cloudId, formId, function (err, cloud) {
            if (err || !cloud) {
                var errorCode = 409;
                if(!cloud) {
                    errorCode = 404;
                }
                apiUtil.handleError(res, err, errorCode);
            } else {
                res.status(200);
                res.send(cloud);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

var removeFormFromCloud = function (cloudId, formId, req, res) {
    try {
        cloudLib.removeFormFromCloud(cloudId, formId, function (err, cloud) {
            if (err || !cloud) {
                var errorCode = 409;
                if(!cloud) {
                    errorCode = 404;
                }
                apiUtil.handleError(res, err, errorCode);
            } else {
                res.status(200);
                res.send(cloud);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

var addMember = function(cloudId, userId, req, res) {
    try {
        cloudLib.addCloudMember(cloudId, userId, function (err, cloud) {
            if (err || !cloud) {
                apiUtil.handleError(res, err, 409);
            } else {
                res.status(200);
                res.send(cloud);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

var addMemberWithWritePermissions = function (cloudId, userId, req, res) {
    try {
        cloudLib.addCloudMemberWithWritePermissions(cloudId, userId, function (err, cloud) {
            if (err || !cloud) {
                apiUtil.handleError(res, err, 409);
            } else {
                res.status(200);
                res.send(cloud);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

var removeMember = function (cloudId, userId, req, res) {
    try {
        cloudLib.removeCloudMember(cloudId, userId, function (err, cloud) {
            if (err || !cloud) {
                apiUtil.handleError(res, err, 409);
            } else {
                res.status(200);
                res.send(cloud);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

var removeMemberWritePermissions = function (cloudId, userId, req, res) {
    try {
        cloudLib.removeCloudMemberWritePermissions(cloudId, userId, function (err, cloud) {
            if (err || !cloud) {
                apiUtil.handleError(res, err, 409);
            } else {
                res.status(200);
                res.send(cloud);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err, __filename);
    }
};


module.exports = {
    create: createCloud,
    getCloudById: getCloudById,
    getUserClouds: getUserClouds,
    getAllClouds: getAllClouds,
    update: updateCloud,
    delete: deleteCloud,
    addFormToCLoud: addFormToCloud,
    removeFormFromCloud: removeFormFromCloud,
    addMember: addMember,
    addMemberWithWritePermissions: addMemberWithWritePermissions,
    removeMember: removeMember,
    removeMemberWritePermissions: removeMemberWritePermissions
};





