var FooForm = require('fooforms-forms');
var Membership = require('fooforms-membership');
var log = require('fooforms-logging').LOG;
var db = require('mongoose').connection;
var statusCodes = require('fooforms-rest').statusCodes;
var fooForm = new FooForm(db);
var membership = new Membership(db);
var paginate = require('express-paginate');
var _ = require('underscore');
var emailer = require('../lib/emails');

var sanitizeUser = function (user) {
    var sanitizedUser;
    if (user && user._id) {
        sanitizedUser = {
            _id: user._id,
            displayName: user.displayName,
            name: user.name,
            photo: user.photo
        };
    }
    return sanitizedUser;
};

var sendNotification = function(updatedBy, post){



    var postDetails = post;

    membership.Team.findById(post.team).populate('members').exec(function (err, team) {
        if (err) return next(err);
        if (!team) {
            //res.status(statusCodes.NOT_FOUND).end();
        } else {
            var users = _.reject(team.members, function (user) {
                return user.displayName===updatedBy.displayName;
            });

            var distributionList = [];

            if (users && users.length > 0) {
                users.forEach(function (user) {
                    distributionList.push(user.email);
                });
            }

            emailer.sendUpdatePostNotification(updatedBy,distributionList,postDetails)
        }
    });

};

exports.create = function (req, res, next) {
    if (req.user) {
        req.body.createdBy = req.user._id;
    }
    fooForm.createPost(req.body, function (err, result) {
        if (err) return next(err);

        if (result.success) {
            fooForm.Post.populate(result.post, {path: 'createdBy', model: 'User'}, function (err, post) {
                post.createdBy = sanitizeUser(post.createdBy);
                res.location('/posts/' + post._id);
                res.status(statusCodes.CREATED).json(post);
            });
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result);
        }
    });
};

exports.findById = function (req, res, next) {
    fooForm.findPostById(req.params.post, function (err, result) {
        if (err) return next(err);

        if (result.success) {

            fooForm.Post.populate(result.data, {path: 'createdBy', model: 'User'}, function (err, post) {
                post.createdBy = sanitizeUser(post.createdBy);
                res.send(post);
            });

        } else {
            res.status(statusCodes.NOT_FOUND).json(result.message);
        }
    });
};

exports.listByPostStream = function (req, res, next) {
    var postStreams = req.query.postStreams.split(',');
    fooForm.Post
        .paginate({postStream: {$in: postStreams}}, req.query.page, req.query.limit, function (err, pageCount, docs, itemCount) {
            if (err) return next(err);

            fooForm.Post.populate(docs, {path: 'createdBy', model: 'User'}, function (err, docs) {

                for (var i = 0; i < docs.length; i++) {
                    docs[i].createdBy = sanitizeUser(docs[i].createdBy);
                }

                res.json({
                    object: 'list',
                    has_more: paginate.hasNextPages(req)(pageCount),
                    data: docs
                });
            });
        }, {sortBy: {lastModified: -1}});
};

exports.update = function (req, res, next) {
    if (req.body.commentStream) {
        req.body.commentStream = req.body.commentStream._id || req.body.commentStream;
    }
    if (req.body.createdBy) {
        req.body.createdBy = req.body.createdBy._id || req.body.createdBy;
    }

    fooForm.updatePost(req.body, function (err, result) {
        if (err) return next(err);

        if (result.success) {
            fooForm.Post.populate(result.post, {path: 'createdBy', model: 'User'}, function (err, post) {
                post.createdBy = sanitizeUser(post.createdBy);
                res.send(post);
                sendNotification(req.user,req.body);
            });

        } else {
            res.status(statusCodes.BAD_REQUEST).json(result.message);
        }
    });
};

exports.remove = function (req, res, next) {
    if (req.body._id === req.params.post) {
        fooForm.deletePost(req.body, function (err, result) {
            if (err) {
                next(err);
            }
            if (result.success) {
                res.status(statusCodes.NO_CONTENT).send();
            } else {
                res.status(statusCodes.BAD_REQUEST).json(result.message);
            }
        });
    } else {
        res.status(statusCodes.BAD_REQUEST).json('Invalid post ID');
    }
};
