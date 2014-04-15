/*jslint node: true*/
"use strict";

// Public interface to expose User methods in a single include.

var userProfile = require('./userProfile');
var userCreator = require('./userCreator');
var userQuery = require('./userQuery');
var userErrors = require('./userErrors');
var userDeleter = require('./userDeleter');


module.exports = {
    User: require('../models/user').User,
    userErrors: userErrors,
    userToProfile: userProfile.userToProfile,
    findByDisplayName: userQuery.findByDisplayName,
    checkEmail: userQuery.checkEmail,
    searchByDisplayName: userQuery.searchByDisplayName,
    findById: userQuery.findUserById,
    createUser: userCreator.createUser,
    deleteUserById: userDeleter.deleteUserById
};
