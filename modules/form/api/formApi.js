/*jslint node: true */
'use strict';
var formLib = require(global.config.modules.FORM);
var apiUtil = require(global.config.modules.APIUTIL);
var formErrors = require('../lib/formErrors');
var log = require('fooforms-logging').LOG;


/**
 * Create a brand new form
 *
 * @param req
 * @param res
 */
var createForm = function (req, res) {
    try {
        var form = req.body;
        form.owner = req.user.id;
        formLib.createForm(form, function (err, form) {
            if (err) {
                if (err.code === 11000) {
                    err.data = 'A form with that label already exists.';
                    form.http_code = 409;
                }
                apiUtil.handleError(res, err);
            } else {
                res.status(200);
                res.send(form);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 * Get all forms owned by a user
 * @param req
 * @param res
 */
var getUserForms = function (req, res) {
    try {
        formLib.getFormsByUserId(req.user.id, function (err, forms) {
            if(!forms && !err) {
                err = formErrors.formNotFoundError;
            }
            if (err) {
                apiUtil.handleError(res, err);
            } else {
                res.status(200);
                res.send(forms);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 *
 * @param id
 * @param res
 */
var getFormById = function (id, res) {
    try {
        formLib.getFormById(id, function (err, form) {
            if (!err && !form) {
                err = formErrors.formNotFoundError;
            }
            if(err){
                apiUtil.handleError(res, err);
            } else {
                res.status(200);
                res.send(form);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 * Updates an form without affecting dynamic data like Posts.
 *
 * @param req
 * @param res
 */
var updateForm = function (req, res) {
    try {
        formLib.updateForm(req.body, function (err, form) {
            if (!err && !form) {
                err = formErrors.formNotFoundError;
            }
            if(err) {
                apiUtil.handleError(res, err);
            } else {
                res.status(200);
                res.send(form);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 * Remove a form and all posts in it.
 *
 * @param req
 * @param res
 */
var deleteForm = function (req, res) {
    try {
        var id = req.body._id;
        formLib.deleteFormById(id, function (err) {
            if (err) {
                apiUtil.handleError(res, err);
            } else {
                res.send(200);
            }
        });

    } catch (err) {
        apiUtil.handleError(res, err);
    }
};


module.exports = {
    create: createForm,
    getUserForms: getUserForms,
    getFormById: getFormById,
    update: updateForm,
    delete: deleteForm
};


