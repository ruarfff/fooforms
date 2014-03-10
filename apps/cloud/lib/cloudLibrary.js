/*jslint node: true */
'use strict';

var Cloud = require('../models/cloud').Cloud;
var cloudCreator = require('./cloudCreator');
var cloudDeleter = require('./cloudDeleter');
var cloudUpdater = require('./cloudUpdater');
var cloudQuery = require('./cloudQuery');
var cloudUtil = require('./cloudUtil');


module.exports = {
    Cloud: Cloud,
    createCloud: cloudCreator.createCloud,
    deleteCloudById: cloudDeleter.deleteCloudById,
    updateCloud: cloudUpdater.updateCloud,
    addAppToCloud: cloudUpdater.addAppToCloud,
    getCloudById: cloudQuery.getCloudById,
    getAllClouds: cloudQuery.getAllClouds,
    getUserClouds: cloudQuery.getUserClouds,
    userHasWritePermissionInCloud: cloudUtil.userHasWritePermissionInCloud,
    checkAndCreateCloudMemberLists: cloudUtil.checkAndCreateCloudMemberLists
};
