/*jslint node: true */

var Form = require('../models/form').Form;
var formErrors = require('./formErrors');
var log = require(global.config.modules.LOGGING).LOG;

exports.createForm = function (formJSON, next) {
    "use strict";
    try {
        var form = new Form(formJSON);

        form.save(function (err, form) {
            if (err) {
                return next(err);
            }
            if (!form.cloud) {
                var User = require(global.config.modules.USER).User;
                User.findById(form.owner, function (err, user) {
                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        return next(formErrors.ownerNotFoundError);
                    }
                    form.cloud = user.cloud;
                    require(global.config.modules.CLOUD).addFormToCloud(form.cloud, form._id, function (err, cloud) {
                        if (err) {
                            return next(err);
                        }
                        if (!cloud) {
                            return next(formErrors.folderNotFoundError);
                        }
                        return (next(err, form));
                    });
                });
            } else {
                return (next(err, form));
            }
        });

    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }

};
