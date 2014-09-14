/*jslint node: true */

var Comment = require('../models/comment').Comment;
var Post = require('../models/post').Post;
var formErrors = require('./formErrors');
var log = require('fooforms-logging').LOG;

exports.createComment = function (commentJSON, next) {
    "use strict";
    try {
        Post.findById(commentJSON.post, function (err, post) {
            if(err) {
                return next(err);
            }
            if(!post) {
                return next(formErrors.postNotFoundError);
            }
            var comment = new Comment(commentJSON);
            comment.post = post._id;
            comment.save(function (err, comment) {
                if(err) {
                    return next(err);
                }
                if(!comment) {
                    return next(formErrors.commentNotCreatedError);
                }
                if(!post.comments) {
                    post.comments = [];
                }
                post.comments.push(comment._id);
                post.save(function (err) {
                    next(err, comment);
                });
            });
        });

    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }

};
