/*jslint node: true*/
"use strict";

// Public interface to expose User methods in a single include.

var userProfile = require('./userProfile');
var userCreator = require('./userCreator');
var userQuery = require('./userQuery');
var userErrors = require('./userErrors');


module.exports = {
    User: require('../models/user').User,
    userErrors: userErrors,
    userToProfile: userProfile.userToProfile,
    checkDisplayName: userQuery.checkDisplayName,
    checkEmail: userQuery.checkEmail,
    createUser: userCreator.createUser
};
