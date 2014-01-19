/*jslint node: true*/
"use strict";

var profile = require('./profile');
var userCreator = require('./userCreator');

module.exports = {
    userProfile: profile.userToProfile,
    createUserLocalStrategy: userCreator.createUserLocalStrategy
};
