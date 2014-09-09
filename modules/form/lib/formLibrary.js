/*jslint node: true */
'use strict';

var Form = require('../models/form').Form;
var Post = require('../models/post').Post;
var Comment = require('../models/comment').Comment;
var formCreator = require('./formCreator');
var formDeleter = require('./formDeleter');
var formUpdater = require('./formUpdater');
var formQuery = require('./formQuery');
var postCreator = require('./postCreator');
var postDeleter = require('./postDeleter');
var postQuery = require('./postQuery');
var postUpdater = require('./postUpdater');
var postEvents = require('./postEvents');
var commentCreator = require('./commentCreator');

module.exports = {
    Form: Form,
    Post: Post,
    Comment: Comment,
    createForm: formCreator.createForm,
    deleteFormById: formDeleter.deleteFormById,
    updateForm: formUpdater.updateForm,
    getFormById: formQuery.getFormById,
    getFormsByFolderId: formQuery.getFormsByFolderId,
    getFormsByUserId: formQuery.getFormsByUserId,
    getAllForms: formQuery.getAllForms,
    createPost: postCreator.createPost,
    deletePostById: postDeleter.deletePostById,
    updatePost: postUpdater.updatePost,
    getUserPosts: postQuery.getUserPosts,
    getPostById: postQuery.getPostById,
    getFormPosts: postQuery.getFormPosts,
    getFolderPosts: postQuery.getFolderPosts,
    doPostEvents: postEvents.doPostEvents,
    createComment: commentCreator.createComment
};
