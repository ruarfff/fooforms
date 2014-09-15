/*jslint node: true */

var Form = require('../models/form').Form;
var Post = require('../models/post').Post;
var formErrors = require('./formErrors');
var log = require('fooforms-logging').LOG;

exports.createPost = function (postJSON, formId, next) {
    "use strict";
    try {
        Form.findById(formId, function (err, form) {
            if(err) {
                return next(err);
            }
            if(!form) {
                return next(formErrors.formNotFoundError);
            }
            var post = new Post(postJSON);
            post.form = form._id;
            post.save(function (err, post) {
                if(err) {
                    return next(err);
                }
                if(!post) {
                    return next(formErrors.postNotCreatedError);
                }
                if(!form.posts) {
                    form.posts = [];
                }
                form.posts.push(post._id);
                form.save(function (err) {
                    next(err, post);
                });
            });
        });

    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }

};
