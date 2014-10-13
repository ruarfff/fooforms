var FooForm = require('fooforms-forms');
var db = require('mongoose').connection;
var statusCodes = require('fooforms-rest').statusCodes;
var fooForm = new FooForm(db);
var _ = require('underscore');
var slug = require('slug');

exports.create = function (req, res, next) {
    if (req.body.displayName) {
        req.body.displayName = slug(req.body.displayName);
    }
    fooForm.createForm(req.body, function (err, result) {
        if (err) {
            return next(err);
        }
        if (result.success) {
            res.location('/forms/' + result.form._id);
            res.status(statusCodes.CREATED).json(result.form);
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
    if (req.body.displayName) {
        req.body.displayName = slug(req.body.displayName);
    }
    fooForm.updateForm(req.body, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            res.send(result.form);
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result.message);
        }
    });
};

exports.remove = function (req, res, next) {
    fooForm.deleteForm({_id: req.body._id}, function (err, result) {
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

exports.checkName = function (req, res, next) {
    var form = req.params.form;
    var folder = req.query.folder;
    var sluggedFormName;

    if (form && folder) {
        sluggedFormName = slug(form);
        fooForm.Folder.findById(folder).populate('forms').exec(function (err, doc) {
            if (err) {
                return next(err);
            }
            var exists = false;

            if (doc) {
                if (_.findWhere(doc.forms, {displayName: sluggedFormName})) {
                    exists = true;
                }
            }

            if (sluggedFormName && (sluggedFormName !== form) && !exists) {
                return res.send({"exists": exists, "slugged": true, "sluggedValue": sluggedFormName})
            } else {
                return res.send({"exists": exists});
            }

        });
    } else {
        return res.send({"exists": false});
    }
};
