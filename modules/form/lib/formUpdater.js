/*jslint node: true */

var Form = require('../models/form').Form;
var log = require(global.config.modules.LOGGING).LOG;

exports.updateForm = function (formJson, next) {
    "use strict";
    try {
        Form.findByIdAndUpdate(formJson._id, {
            name: formJson.name,
            icon: formJson.icon,
            btnLabel: formJson.btnLabel,
            description: formJson.description,
            menuLabel: formJson.menuLabel,
            fields: formJson.fields,
            formEvents: formJson.formEvents,
            sharing: formJson.sharing,
            privileges: formJson.privileges,
            settings: formJson.settings
        }, { multi: false }, function (err, form) {
            next(err, form);
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};