/*jslint node: true */
"use strict";

var ownerNotFoundError = new Error('Cloud not find application owner');
ownerNotFoundError.http_code = 404;

var folderNotFoundError = new Error('Could not find Folder to store form');
folderNotFoundError.http_code = 404;

var appNotFoundError = new Error('Could not find application');
appNotFoundError.http_code = 404;

var postNotCreatedError = new Error('The post could not be saved');
postNotCreatedError.http_code = 500;

var postDeletionError = new Error('Error deleting post');
postDeletionError.http_code = 500;

var postNotFoundError = new Error('Could not find post');
postNotFoundError.http_code = 404;

module.exports = {
    ownerNotFoundError: ownerNotFoundError,
    folderNotFoundError: folderNotFoundError,
    appNotFoundError: appNotFoundError,
    postNotCreatedError: postNotCreatedError,
    postDeletionError: postDeletionError,
    postNotFoundError: postNotFoundError
};