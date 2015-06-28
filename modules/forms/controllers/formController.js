var FooForm = require('fooforms-forms');
var db = require('mongoose').connection;
var statusCodes = require('fooforms-rest').statusCodes;
var fooForm = new FooForm(db);
var _ = require('lodash');
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
    var folder = req.params.folder;
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

exports.moveToFolder = function (req, res, next) {
    var formId = req.body.form;
    var folderId = req.body.folder;

    fooForm.Form.findById(formId, function (err, form) {
        if (err) return next(err);
        if (!form) return res.status(statusCodes.NOT_FOUND).send('Form Not Found');
        fooForm.Folder.findById(form.folder, function (err, previousFolder) {
            if (err) return next(err);
            if (!previousFolder) return res.status(statusCodes.NOT_FOUND).send('Folder Not Found');
            fooForm.Folder.findById(folderId, function (err, folder) {
                if (err) return next(err);
                if (!folder) return res.status(statusCodes.NOT_FOUND).send('Folder Not Found');

                folder.forms.push(form._id);
                form.folder = folder._id;

                folder.save(function (err) {
                    if (err) return next(err);
                    form.save(function (err, updatedForm) {
                        if (err) return next(err);
                        var index = previousFolder.forms.indexOf(form._id);
                        if (index > -1) {
                            previousFolder.forms.splice(index, 1);
                        }
                        previousFolder.save(function (err) {
                            if (err) return next(err);
                            res.status(statusCodes.OK).send(updatedForm);
                        });
                    });
                });
            });
        });

    });
};
