var FooForm = require('fooforms-forms');
var db = require('mongoose').connection;
var statusCodes = require('fooforms-rest').statusCodes;
var fooForm = new FooForm(db);

exports.create = function (req, res, next) {
    fooForm.createForm(req.body, function (err, result) {
        if (err) {
            return next(err);
        }
        if (result.success) {
            res.location('/forms/' + result.form._id);
            res.status(statusCodes.CREATED).json(result);
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result);
        }
    });
};

exports.findById = function (req, res, next) {
    fooForm.findFormById(req.params.form, function (err, result) {
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

exports.listByFolder = function (req, res, next) {
    fooForm.Folder.findById(req.query.folder).lean().populate('forms').exec(function (err, docs) {
        if (err) {
            next(err);
        }
        res.send(docs);
    });
};

exports.update = function (req, res, next) {
    if (req.body && req.body._id !== req.params.form) {
        req.body._id = req.params.form;
    }
    fooForm.updateForm(req.body, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            res.send(result);
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result.message);
        }
    });
};

exports.remove = function (req, res, next) {
    fooForm.deleteForm({_id: req.params.form}, function (err, result) {
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
