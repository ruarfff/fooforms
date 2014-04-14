/*jslint node: true */
'use strict';
var log = require( global.config.modules.LOGGING ).LOG;

/**
 * Finds a single user by looking for a full match in the display name.
 *
 * @param displayName
 * @param next
 */
exports.findByDisplayName = function ( displayName, next ) {
    require( '../models/user' ).User.findByDisplayName( displayName.toLowerCase(), next );
};


/**
 * Finds a single user by matching the full email address.
 *
 * @param email
 * @param next
 */
exports.checkEmail = function ( email, next ) {
    require( '../models/user' ).User.findUserByEmail( email, next );
};

/**
 * Searches for users based on the search text provided. Will return a list of users
 * who's display names match part of the search text.
 *
 * @param searchText
 * @param next
 */
exports.searchByDisplayName = function ( searchText, next ) {
    require( '../models/user' ).User.searchByDisplayName(searchText, next);
};


exports.findUserById = function ( id, next ) {
    require( '../models/user' ).User.findById( id, next );
};