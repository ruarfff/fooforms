/*jslint node: true */
'use strict';
var appLib = require(global.config.apps.APP);
var log = require(global.config.apps.LOGGING).LOG;


/**
 * Create new Post
 */
var createPost = function (req, res) {
    try {
        log.debug('creating post');
        var body = req.body;
        var postDetails = {
            name: body.name,
            description: body.description || '',
            icon: body.icon || '',
            fields: body.fields
        };
        log.debug(JSON.stringify(postDetails));
        appLib.createPost(postDetails, req.appId, function (err, post) {
            if (err) {
                var responseCode = 500;
                handleError(res, err, responseCode);
            } else {
                res.status(200);
                res.send(post);
            }
        });
    } catch (err) {
        handleError(res, err, 500);
    }
};


var getPostById = function (req, res, id) {
    try {
        appLib.getPostById(id, function (err, post) {
            if (err || !post) {
                handleError(res, err, 404);
            } else {
                res.status(200);
                res.send(post);
            }
        });
    } catch (err) {
        handleError(res, err, 500);
    }
};

var getAppPosts = function (req, res, appId) {

};

var getUserPosts = function (req, res) {
    try {
        appLib.getUserPosts(req.user.id, function (err, posts) {
            if (err || !posts) {
                handleError(res, err, 404);
            } else {
                res.status(200);
                res.send(posts);
            }
        });
    } catch (err) {
        handleError(res, err, 500);
    }
};


var updatePost = function (req, res) {
    try {
        appLib.updatePost(req.body, function (err, post) {
            if (err || !post) {
                handleError(res, err, 409);
            } else {
                res.status(200);
                res.send(post);
            }
        });
    } catch (err) {
        handleError(res, err, 500);
    }
};

var deletePost = function (req, res) {
    try {
        var id = req.body._id;
        appLib.deletePostById(id, function (err, post) {
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
        log.error(err.toString());
        res.status(responseCode);
        res.send(err);
    } catch (err) {
        log.error(err);
        res.send(500);
    }
};


module.exports = {
    create: createPost,
    getPostById: getPostById,
    getUserPosts: getUserPosts,
    getAppPosts: getAppPosts,
    update: updatePost,
    delete: deletePost
};





