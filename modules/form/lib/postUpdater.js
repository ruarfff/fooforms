/*jslint node: true */

var Post = require('../models/post').Post;
var formErrors = require('./formErrors');
var log = require('fooforms-logging').LOG;

exports.updatePost = function (postJson, next) {
    "use strict";
    try {
        Post.findByIdAndUpdate(postJson._id, {
            name: postJson.name || '',
            description: postJson.description || '',
            icon: postJson.icon || '',
            menuLabel: postJson.menuLabel || '',
            form: postJson.form,
            fields: postJson.fields
        }, { multi: false }, function (err, post) {
            if (!err && !post) {
                return next(formErrors.postNotFoundError);
            }
            next(err, post);
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }

};
