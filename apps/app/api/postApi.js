/*jslint node: true */
'use strict';
var appLib = require(global.config.apps.APP);
var apiUtil = require(global.config.apps.APIUTIL);
var appErrors = require('../lib/appErrors');
var log = require(global.config.apps.LOGGING).LOG;


/**
 *
 * @param req
 * @param res
 */
var createPost = function (req, res) {
    try {
        log.debug('creating post');
        log.debug(JSON.stringify(req.body));
        var body = req.body;
        var postDetails = {
            name: body.name,
            description: body.description || '',
            icon: body.icon || '',
            fields: body.fields
        };
        appLib.createPost(postDetails, req.body.app, function (err, post) {
            if (!err && !post) {
                err = appErrors.postNotFoundError;
            }
            if(err) {
                apiUtil.handleError(res, err);
            } else {
                res.status(200);
                res.send(post);

                appLib.doPostEvents('newPost', req.body, function (err) {
                    if (err) {
                        log.error(err);
                    }
                });
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 *
 * @param req
 * @param res
 * @param id
 */
var getPostById = function (req, res, id) {
    try {
        appLib.getPostById(id, function (err, post) {
            if (!err && !post) {
                err = appErrors.postNotFoundError;
            }
            if(err) {
                apiUtil.handleError(res, err);
            } else {
                res.status(200);
                res.send(post);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 *
 * @param req
 * @param res
 * @param appId
 */
var getAppPosts = function (req, res, appId) {
    try {
        appLib.getAppPosts(appId, function (err, posts) {
            if (!err && !posts) {
                err = appErrors.postNotFoundError;
            }
            if(err) {
                apiUtil.handleError(res, err);
            } else {
                res.status(200);
                res.send(posts);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 *
 * @param req
 * @param res
 * @param cloudId
 */
var getCloudPosts = function (req, res, cloudId) {
    try {
        appLib.getCloudPosts(cloudId, function (err, posts) {
            if (!err && !posts) {
                err = appErrors.postNotFoundError;
            }
            if(err) {
                apiUtil.handleError(res, err);
            } else {
                res.status(200);
                res.send(posts);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

var getUserPosts = function (req, res) {
    try {
        appLib.getUserPosts(req.user.id, function (err, posts) {
            if (!err && !posts) {
                err = appErrors.postNotFoundError;
            }
            if(err) {
                apiUtil.handleError(res, err);
            } else {
                res.status(200);
                res.send(posts);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};


var updatePost = function (req, res) {
    try {
        appLib.updatePost(req.body, function (err, post) {
            if (!err && !post) {
                err = appErrors.postNotFoundError;
            }
            if(err) {
                apiUtil.handleError(res, err);
            } else {
                res.status(200);
                res.send(post);
                appLib.doPostEvents('statusChange', req.body, function (err) {
                    if (err) {
                        log.error(err);
                    }
                });
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

var deletePost = function (req, res) {
    try {
        var id = req.body._id;
        appLib.deletePostById(id, function (err) {
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
    create: createPost,
    getPostById: getPostById,
    getUserPosts: getUserPosts,
    getAppPosts: getAppPosts,
    update: updatePost,
    delete: deletePost,
    getCloudPosts: getCloudPosts
};





