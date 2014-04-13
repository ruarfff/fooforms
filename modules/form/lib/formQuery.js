/*jslint node: true */

var Form = require('../models/form').Form;
var log = require(global.config.modules.LOGGING).LOG;

exports.getFormById = function (id, next) {
    "use strict";
    try {
        Form.findById(id, next);
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

exports.getFormsByFolderId = function (folderId, next) {
    "use strict";
    try {
            next();
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

exports.getFormsByUserId = function (userId, next) {
    "use strict";
    try {
        Form.find({ owner: userId }, function (err, forms) {
            next(err, forms);
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

exports.getAllForms = function (next) {
    "use strict";
    try {
        next();
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};
