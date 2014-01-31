/*jslint node: true */
'use strict';

// Single file exposing all User API functionality

var profile = require( './profile' );
var userCreator = require( './userCreator' );
var userQuery = require( './userQuery' );


module.exports = {
    me: profile.me,
    updateProfile: profile.updateProfile,
    create: userCreator.create,
    checkUserName: userQuery.checkUserName
};


