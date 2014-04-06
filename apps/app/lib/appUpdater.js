/*jslint node: true */

var App = require('../models/app').App;
var log = require(global.config.apps.LOGGING).LOG;

exports.updateApp = function (appJson, next) {
    "use strict";
    try {
        App.findByIdAndUpdate(appJson._id, {
            name: appJson.name,
            icon: appJson.icon,
            btnLabel: appJson.btnLabel,
            description: appJson.description,
            menuLabel: appJson.menuLabel,
            fields: appJson.fields,
            url: appJson.url,
            formEvents: appJson.formEvents,
            sharing: appJson.sharing,
            privileges: appJson.privileges
        }, { multi: false }, function (err, app) {
            next(err, app);
        });
    } catch (err) {
        log.error(err);
        next(err);
    }
};