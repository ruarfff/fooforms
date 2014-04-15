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
            if (!form.folder) {
                var User = require(global.config.modules.USER).User;
                User.findById(form.owner, function (err, user) {
                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        return next(formErrors.ownerNotFoundError);
                    }
                    form.folder = user.folder;
                    require(global.config.modules.FOLDER).addFormToFolder(form.folder, form._id, function (err, folder) {
                        if (err) {
                            return next(err);
                        }
                        if (!folder) {
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
