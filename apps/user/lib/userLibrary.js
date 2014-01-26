/*jslint node: true*/
"use strict";

// Public interface to expose User methods in a single include.

var profile = require( './profile' );
var userCreator = require( './userCreator' );
var userQuery = require( './userQuery' );


module.exports = {
    User: require( '../models/user' ).User,
    userProfile: profile.userToProfile,
    createUserLocalStrategy: userCreator.createUserLocalStrategy,
    checkDisplayName: userQuery.checkDisplayName
};
