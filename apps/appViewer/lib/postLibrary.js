/*jslint node: true */
'use strict';

var Post = require('../models/post').Post;
var postCreator = require('./postCreator');
var postDeleter = require('./postDeleter');
var postUpdater = require('./postUpdater');
var postQuery = require('./postQuery');


module.exports = {
    Post: Post,
    createPost: postCreator.createPost,
    deletePostById: postDeleter.deletePostById,
    updatePost: postUpdater.updatePost,
    getPostById: postQuery.getPostById,
    getAllPosts: postQuery.getAllPosts,
    getUserPosts: postQuery.getUserPosts
};
