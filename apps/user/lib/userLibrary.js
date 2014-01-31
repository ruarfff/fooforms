/*jslint node: true*/
"use strict";

var User = require('../models/user').User;
var log = require(global.config.apps.LOGGING).LOG;

var profile = require('./profile');
var userCreator = require('./userCreator');

var checkDisplayName = function (displayName) {
    var query = User.find({ displayName: /displayName/i });
    return query.exec();
};

module.exports = {
    userProfile: profile.userToProfile,
    createUserLocalStrategy: userCreator.createUserLocalStrategy,
    checkDisplayName: checkDisplayName
};
