var log = require('fooforms-logging').LOG;
var FooForm = require('fooforms-forms');
var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var statusCodes = require('fooforms-rest').statusCodes;
var fooForm = new FooForm(db);
var membership = new Membership(db);


exports.getEmbeddedForm = function (req, res, next) {
    require(global.config.modules.FORM).getFormById(req.params.form, function (err, form) {
        if (err) {
            errorResponseHandler.handleError(res, err);
        }
        else if (!form) {
            err = new Error('form not found');
            err.http_code = 404;
            errorResponseHandler.handleError(res, err);
        } else {
            res.render(viewDir + '/embeddedForm', {
                formId: form._id,
                formName: form.name
            });
        }
    });
};

exports.fetchFormJson = function (req, res, next) {
    require(global.config.modules.FORM + '/api/formApi').getFormById(req.params.form, res);
};
