/*jslint node: true */

var App = require('../models/app').App;
var log = require(global.config.apps.LOGGING).LOG;

exports.updateApp = function (appJson, next) {
    "use strict";
    try {
        App.findByIdAndUpdate(appJson._id, {
            name: appJson.name,
            icon: appJson.icon,
            description: appJson.description,
            menuLabel: appJson.menuLabel,
            btnLabel: appJson.btnLabel,
            settings: appJson.settings,
            fields: appJson.fields,
            version: appJson.version,
            lastModified: appJson.lastModified,
            owner: appJson.owner
        }, { multi: false }, function (err, app) {
            next(err, app);
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }
};
