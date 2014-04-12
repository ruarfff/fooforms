/*jslint node: true*/
"use strict";

var cloudNotFoundError = new Error('Cloud not found');
cloudNotFoundError.http_code = 404;

var userNotFoundError = new Error('User not found');
userNotFoundError.http_code = 404;

var formNotFoundError = new Error('Form not found');
formNotFoundError.http_code = 404;

var userNotAuthorisedToPublishError = new Error('User not authorised to publish to this cloud.');
userNotAuthorisedToPublishError.http_code = 403;

var formAlreadyPublishedError = new Error('Form is already published to a Cloud.');
formAlreadyPublishedError.http_code = 403;

var formNotInCloudError = new Error('Form does not exist in cloud');
formNotInCloudError.http_code = 400;

var cloudHasNoFormsError = new Error('Cloud has no forms');
cloudHasNoFormsError.http_code = 400;

module.exports = {
    cloudNotFoundError: cloudNotFoundError,
    userNotFoundError: userNotFoundError,
    formNotFoundError: formNotFoundError,
    userNotAuthorisedToPublishError: userNotAuthorisedToPublishError,
    formAlreadyPublishedError: formAlreadyPublishedError,
    formNotInCloudError: formNotInCloudError,
    cloudHasNoFormsError: cloudHasNoFormsError
};