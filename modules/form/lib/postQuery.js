/*jslint node: true */
"use strict";

var log = require(global.config.modules.LOGGING).LOG;
var formErrors = require('./formErrors');
var async = require("async");
var _ = require('underscore');


var getPostById = function (id, next) {
    try {
        require('../models/post').Post.findById(id, next);
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

var getAllPosts = function (next) {
    try {
        require('../models/post').Post.find({}, next);
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

var getUserPosts = function (userId, next) {
    try {
        require(global.config.modules.CLOUD).Cloud.find({owner: userId}).populate('forms').exec(function (err, clouds) {
            if (err) {
                return next(err);
            }

            if (!clouds) {
                return next(formErrors.userCloudsNotFound);
            }

            var userPosts = [];

            async.each(clouds,
                function(cloud, done){
                    require('../models/form').Form.populate(cloud.forms, 'posts', function(err, forms) {
                        if (err) {
                            return done(err);
                        }
                        if(!forms) {
                            return done(formErrors.formNotFoundError);
                        }
                        forms.forEach(function (form) {
                            if(form.posts) {
                                form.posts.forEach(function (post) {
                                    userPosts.push(post);
                                });
                            }
                        });
                        return done();
                    });
                },
                function(err){
                    userPosts = _.sortBy(userPosts, function (post) {
                        return post._id;
                    }).reverse();

                    return next(err, userPosts);
                }
            );
        });

    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

var getCloudPosts = function (cloudId, next) {
    try {
        require(global.config.modules.CLOUD).Cloud.findById(cloudId).populate('forms').exec(function(err, cloud) {
            require('../models/form').Form.populate(cloud.forms, 'posts', function(err, forms) {
                if (err) {
                    return next(err);
                }
                if (!cloud) {
                    return next(formErrors.userCloudsNotFound);
                }
                var cloudPosts = [];
                forms.forEach(function (form) {
                    form.posts.forEach(function (post) {
                        cloudPosts.push(post);
                    });
                });
                return next(err, cloudPosts.reverse());
            });
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

var getFormPosts = function (formId, next) {
    try {
        require('../models/form').Form.findById(formId).populate('posts').exec(function (err, form) {
            if (err) {
                return next(err);
            }
            if (form) {
                next(err, form.posts.reverse());
            } else {
                return next(formErrors.formNotFoundError);
            }
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

module.exports = {
    getFormPosts: getFormPosts,
    getUserPosts: getUserPosts,
    getAllPosts: getAllPosts,
    getPostById: getPostById,
    getCloudPosts: getCloudPosts
};