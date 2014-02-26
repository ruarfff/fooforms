/*jslint node: true */
'use strict';

var Cloud = require('../models/cloud').Cloud;
var cloudCreator = require('./cloudCreator');
var cloudDeleter = require('./cloudDeleter');
var cloudUpdater = require('./cloudUpdater');
var cloudQuery = require('./cloudQuery');


module.exports = {
    Cloud: Cloud,
    createCloud: cloudCreator.createCloud,
    deleteCloudById: cloudDeleter.deleteCloudById,
    updateCloud: cloudUpdater.updateCloud,
    getCloudById: cloudQuery.getCloudById,
    getAllClouds: cloudQuery.getAllClouds,
    getUserClouds: cloudQuery.getUserClouds
};
