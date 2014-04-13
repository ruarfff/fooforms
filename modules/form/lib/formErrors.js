/*jslint node: true */
"use strict";

var ownerNotFoundError = new Error('Folder not find form owner');
ownerNotFoundError.http_code = 404;

var folderNotFoundError = new Error('Could not find Folder to store form');
folderNotFoundError.http_code = 404;

var formNotFoundError = new Error('Could not find form');
formNotFoundError.http_code = 404;

var postNotCreatedError = new Error('The post could not be saved');
postNotCreatedError.http_code = 500;

var postDeletionError = new Error('Error deleting post');
postDeletionError.http_code = 500;

var postNotFoundError = new Error('Could not find post');
postNotFoundError.http_code = 404;

var formOwnerNotFound = new Error('Could not find user');
formOwnerNotFound.http_code = 404;

var userFoldersNotFound = new Error('Could  not find user folders');
userFoldersNotFound.http_code = 404;

module.exports = {
    ownerNotFoundError: ownerNotFoundError,
    folderNotFoundError: folderNotFoundError,
    formNotFoundError: formNotFoundError,
    postNotCreatedError: postNotCreatedError,
    postDeletionError: postDeletionError,
    postNotFoundError: postNotFoundError,
    formOwnerNotFound: formOwnerNotFound,
    userFoldersNotFound: userFoldersNotFound
};