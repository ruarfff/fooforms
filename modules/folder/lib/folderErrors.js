/*jslint node: true*/
"use strict";

var folderNotFoundError = new Error('Folder not found');
folderNotFoundError.http_code = 404;

var userNotFoundError = new Error('User not found');
userNotFoundError.http_code = 404;

var formNotFoundError = new Error('Form not found');
formNotFoundError.http_code = 404;

var userNotAuthorisedToPublishError = new Error('User not authorised to publish to this folder.');
userNotAuthorisedToPublishError.http_code = 403;

var formAlreadyPublishedError = new Error('Form is already published to a Folder.');
formAlreadyPublishedError.http_code = 403;

var formNotInFolderError = new Error('Form does not exist in folder');
formNotInFolderError.http_code = 400;

var folderHasNoFormsError = new Error('Folder has no forms');
folderHasNoFormsError.http_code = 400;

module.exports = {
    folderNotFoundError: folderNotFoundError,
    userNotFoundError: userNotFoundError,
    formNotFoundError: formNotFoundError,
    userNotAuthorisedToPublishError: userNotAuthorisedToPublishError,
    formAlreadyPublishedError: formAlreadyPublishedError,
    formNotInFolderError: formNotInFolderError,
    folderHasNoFormsError: folderHasNoFormsError
};