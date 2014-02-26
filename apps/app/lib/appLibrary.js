/*jslint node: true */
'use strict';

var App = require('../models/app').App;
var appCreator = require('./appCreator');
var appDeleter = require('./appDeleter');
var appUpdater = require('./appUpdater');
var appQuery = require('./appQuery');


module.exports = {
    App: App,
    createApp: appCreator.createApp,
    deleteAppById: appDeleter.deleteAppById,
    updateApp: appUpdater.updateApp,
    getAppById: appQuery.getAppById,
    getAppsByCloudId: appQuery.getAppsByCloudId,
    getAppsByUserId: appQuery.getAppsByUserId,
    getAllApps: appQuery.getAllApps
};

