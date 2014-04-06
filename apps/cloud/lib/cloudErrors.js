/*jslint node: true*/
"use strict";

var cloudNotFoundError = new Error('Cloud not found');
cloudNotFoundError.http_code = 404;

var userNotFoundError = new Error('User not found');
userNotFoundError.http_code = 404;

var appNotFoundError = new Error('App not found');
appNotFoundError.http_code = 404;

var userNotAuthorisedToPublishError = new Error('User not authorised to publish to this cloud.');
userNotAuthorisedToPublishError.http_code = 403;

var appAlreadyPublishedError = new Error('App is already published to a Cloud.');
appAlreadyPublishedError.http_code = 403;

var appNotInCloudError = new Error('App does not exist in cloud');
appNotInCloudError.http_code = 400;

var cloudHasNoAppsError = new Error('Cloud has no apps');
cloudHasNoAppsError.http_code = 400;

module.exports = {
    cloudNotFoundError: cloudNotFoundError,
    userNotFoundError: userNotFoundError,
    appNotFoundError: appNotFoundError,
    userNotAuthorisedToPublishError: userNotAuthorisedToPublishError,
    appAlreadyPublishedError: appAlreadyPublishedError,
    appNotInCloudError: appNotInCloudError,
    cloudHasNoAppsError: cloudHasNoAppsError
};