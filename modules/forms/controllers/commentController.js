var FooForm = require('fooforms-forms');
var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var fooForm = new FooForm(db);
var membership = new Membership(db);
var statusCodes = require('fooforms-rest').statusCodes;
var paginate = require('express-paginate');
var async = require('async');
var _ = require('lodash');


var getCommenter = function (id, next) {
    membership.findUserById(id, function (err, result) {
        var commenter;
        var user;

        if (!err && !result.success) {
            err = new Error('Failed to get commenter');
            next(err);
        } else {
            user = result.data;

            commenter = {
                _id: user._id,
                displayName: user.displayName,
                name: user.name,
                photo: user.photo
            };

            next(err, commenter);
        }
    });
};

exports.create = function (req, res, next) {
    if (req.user) {
        req.body.commenter = req.user._id;
    }
    fooForm.createComment(req.body, function (err, result) {
        if (err) {
            return next(err);
        }
        if (result.success) {
            getCommenter(result.comment.commenter, function (err, commenter) {
                if (commenter) {
                    result.comment.commenter = commenter;
                }
                res.location('/comments/' + result.comment._id);
                res.status(statusCodes.CREATED).json(result.comment);
            });
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result);
        }
    });
};

exports.findById = function (req, res, next) {
    fooForm.findCommentById(req.params.comment, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            var comment = result.data;

            getCommenter(comment.commenter, function (err, commenter) {
                if (commenter) {
                    result.data.commenter = commenter;
                }
                res.status(statusCodes.OK).json(result.data);
            });
        } else {
            res.status(statusCodes.NOT_FOUND).json(result.message);
        }
    });
};

exports.listByStream = function (req, res, next) {
    fooForm.Comment
        .paginate({commentStream: req.query.commentStream}, req.query.page, req.query.limit, function (err, pageCount, docs, itemCount) {
            if (err) {
                next(err);
            }

            async.eachSeries(docs, function (comment, callback) {
                getCommenter(comment.commenter, function (err, commenter) {
                    if (commenter) {
                        var index = docs.indexOf(comment);
                        if (index > -1) {
                            var fullComment = docs[index].toObject();
                            fullComment.commenter = commenter;
                            docs[index] = fullComment;
                        }
                    }
                    callback();
                });
            }, function () {
                res.send({
                    object: 'list',
                    has_more: paginate.hasNextPages(req)(pageCount),
                    data: docs
                });
            });
        }, {sortBy: {lastModified: 1}});
};

exports.update = function (req, res, next) {
    fooForm.updateComment(req.body, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            getCommenter(result.comment.commenter, function (err, commenter) {
                if (commenter) {
                    result.comment.commenter = commenter;
                }
                res.status(statusCodes.OK).json(result.comment);
            });
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result.message);
        }
    });
};

exports.remove = function (req, res, next) {
    fooForm.deleteComment({_id: req.body._id}, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            res.status(statusCodes.NO_CONTENT).send();
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result.message);
        }
    });
};
