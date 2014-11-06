var log = require('fooforms-logging').LOG;
var path = require('path');
var viewDir = path.resolve(__dirname, '../views');
var FooForm = require('fooforms-forms');
var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var statusCodes = require('fooforms-rest').statusCodes;
var fooForm = new FooForm(db);
var membership = new Membership(db);


exports.renderForm = function (req, res, next) {
    fooForm.findFormById(req.params.form, function (err, result) {
        if (err) return next(err);
        var form = result.data;
        if (!result.success || !form) {
            res.status(404).json('form not found');
        } else {
            res.render(viewDir + '/embeddedForm', {
                formId: form._id,
                formName: form.displayName
            });
        }
    });
};

exports.getForm = function (req, res, next) {
    fooForm.findFormById(req.params.form, function (err, result) {
        if (err) return next(err);
        var form = result.data;
        if (!result.success || !form) {
            res.status(404).json('form not found');
        } else {
            res.send(form);
        }
    });
};

exports.createPost = function (req, res, next) {
    fooForm.createPost(req.body, function (err, result) {
        if (err) return next(err);
        if (result.success) {
            res.status(statusCodes.CREATED).json(result.post);
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result);
        }
    });
};
