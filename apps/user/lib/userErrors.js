/*jslint node: true*/
"use strict";

var invalidUserDetailsError = new Error('Invalid user details provided.');
invalidUserDetailsError.http_code = 400;

var invalidUserNameError = new Error('Invalid user name provided.');
invalidUserNameError.http_code = 403;

var invalidEmailError = new Error('Invalid email provided');
invalidEmailError.http_code = 403;

var unknownUserCreationError = new Error('An unknown error occurred while saving user details.');
unknownUserCreationError.http_code = 500;

var notImplementedError = new Error('Sorry, this feature has not been implemented yet');
notImplementedError.http_code = 501;

module.exports = {
    invalidUserDetailsError: invalidUserDetailsError,
    unknownUserCreationError: unknownUserCreationError,
    notImplementedError: notImplementedError,
    invalidUserNameError: invalidUserNameError,
    invalidEmailError: invalidEmailError
};