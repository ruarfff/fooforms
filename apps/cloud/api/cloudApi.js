/*jslint node: true */
'use strict';

var cloudCreator = require('./cloudCreator');
var cloudQuery = require('./cloudQuery');
var cloudUpdater = require('./cloudUpdater');

module.exports = {
    create: cloudCreator.create,
    getCloudById: cloudQuery.getCloudById,
    getUserClouds: cloudQuery.getAllClouds,
    update: cloudUpdater.update,
    delete: cloudUpdater.delete
};





