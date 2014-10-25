var FooForm = require('fooforms-forms');
var db = require('mongoose').connection;
var statusCodes = require('fooforms-rest').statusCodes;
var fooForm = new FooForm(db);
var paginate = require('express-paginate');

exports.create = function (req, res, next) {
    if (req.user) {
        req.body.commenter = req.user._id;
    }
    fooForm.createComment(req.body, function (err, result) {
        if (err) {
            return next(err);
        }
        if (result.success) {
            res.location('/comments/' + result.comment._id);
            res.status(statusCodes.CREATED).json(result.comment);
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
            res.send(result.data);
        } else {
            res.status(statusCodes.NOT_FOUND).json(result.message);
        }
    });
};

exports.listByStream = function (req, res, next) {
    fooForm.Comment
        .paginate({commentStream: req.query.stream}, req.query.page, req.query.limit, function (err, pageCount, docs, itemCount) {
            if (err) {
                next(err);
            }
            res.json({
                object: 'list',
                has_more: paginate.hasNextPages(req)(pageCount),
                data: docs
            });
        }, {sortBy: {lastModified: -1}});
};

exports.update = function (req, res, next) {
    fooForm.updateComment(req.body, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            res.send(result.comment);
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
