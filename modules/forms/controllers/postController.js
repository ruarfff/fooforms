var FooForm = require('fooforms-forms');
var log = require('fooforms-logging').LOG;
var db = require('mongoose').connection;
var statusCodes = require('fooforms-rest').statusCodes;
var fooForm = new FooForm(db);

exports.create = function (req, res, next) {
    fooForm.createPost(req.body, function (err, result) {
        if (err) {
            return next(err);
        }
        if (result.success) {
            res.location('/posts/' + result.post._id);
            res.status(statusCodes.CREATED).json(result.post);
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result);
        }
    });
};

exports.findById = function (req, res, next) {
    fooForm.findPostById(req.params.post, function (err, result) {
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

exports.listByPostStream = function (req, res, next) {
    fooForm.Post.find({postStream: req.query.postStream}, function (err, docs) {
        if (err) {
            next(err);
        }
        res.send(docs);
    });
};

exports.update = function (req, res, next) {
    fooForm.updatePost(req.body, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            res.send(result.post);
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result.message);
        }
    });
};

exports.remove = function (req, res, next) {
    log.info(req.body);
    fooForm.deletePost({_id: req.body._id}, function (err, result) {
        if (err) {
            next(err);
        }
        console.log(result);
        if (result.success) {
            res.status(statusCodes.NO_CONTENT).send();
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result.message);
        }
    });
};
