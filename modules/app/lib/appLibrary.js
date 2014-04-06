/*jslint node: true */
'use strict';

var App = require('../models/app').App;
var Post = require('../models/post').Post;
var appCreator = require('./appCreator');
var appDeleter = require('./appDeleter');
var appUpdater = require('./appUpdater');
var appQuery = require('./appQuery');
var postCreator = require('./postCreator');
var postDeleter = require('./postDeleter');
var postQuery = require('./postQuery');
var postUpdater = require('./postUpdater');
var postEvents = require('./postEvents');

module.exports = {
    App: App,
    Post: Post,
    createApp: appCreator.createApp,
    deleteAppById: appDeleter.deleteAppById,
    updateApp: appUpdater.updateApp,
    getAppById: appQuery.getAppById,
    getAppsByCloudId: appQuery.getAppsByCloudId,
    getAppsByUserId: appQuery.getAppsByUserId,
    getAllApps: appQuery.getAllApps,
    createPost: postCreator.createPost,
    deletePostById: postDeleter.deletePostById,
    updatePost: postUpdater.updatePost,
    getUserPosts: postQuery.getUserPosts,
    getPostById: postQuery.getPostById,
    getAppPosts: postQuery.getAppPosts,
    getCloudPosts: postQuery.getCloudPosts,
    doPostEvents: postEvents.doPostEvents
};