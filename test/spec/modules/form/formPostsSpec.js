/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var formSpecUtil = require('./form-spec-util');
var userSpecUtil = require('../user/user-spec-util');

describe('Form Post functions', function () {
    var formLib;
    var userLib;

    before(function () {
        formLib = require(global.config.modules.FORM);
        userLib = require(global.config.modules.USER);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });

    var createTestFormWithUser = function (next) {
        var testUser = userSpecUtil.getMockValidUser();
        userLib.createUser(testUser, function (err, user) {
            if (err) {
                return next(err);
            }
            should.exist(user);
            createTestForm(user._id, next);
        });
    };

    var createTestForm = function(userId, next) {
        var testForm = formSpecUtil.getMockValidForm();
        testForm.owner = userId;
        formLib.createForm(testForm, function (err, form) {
            if (err) {
                return next(err);
            }
            should.exist(form);
            form.owner.should.eql(userId);
            next(form);
        });
    };

    var createTestFormWithPosts = function (userId, next) {
        createTestForm(userId, function (form) {
            var testPost1 = formSpecUtil.getMockValidPost();
            var testPost2 = formSpecUtil.getMockValidPost();
            formLib.createPost(testPost1, form._id, function (err, post1) {
                if (err) {
                    return next(err);
                }
                should.exist(post1);
                formLib.createPost(testPost2, form._id, function (err, post2) {
                    if (err) {
                        return next(err);
                    }
                    should.exist(post2);
                    formLib.getFormById(form._id, function (err, form) {
                        if (err) {
                            return next(err);
                        }
                        should.exist(form);
                        next(form);
                    });
                });
            });
        });
    };


    describe('Creating a Post', function () {
        it('with valid entries should save without error', function (done) {
            createTestFormWithUser(function (form) {
                var testPost = formSpecUtil.getMockValidPost();
                formLib.createPost(testPost, form._id, function (err, post) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(post);
                    post.name.should.equal(testPost.name);
                    post.description.should.equal(testPost.description);
                    post.icon.should.equal(testPost.icon);
                    post.menuLabel.should.equal(testPost.menuLabel);
                    post.fields.should.be.instanceof(Array).and.have.lengthOf(testPost.fields.length);
                    post.form.should.eql(form._id);
                    formLib.getFormById(form._id, function (err, form) {
                        if (err) {
                            return done(err);
                        }
                        should.exist(form);
                        should.exist(form.posts);
                        form.posts.indexOf(post._id).should.not.equal(-1);
                        done();
                    });
                });
            });
        });
        it('with invalid form Id should not save and report an error', function (done) {
            var testPost = formSpecUtil.getMockValidPost();
            formLib.createPost(testPost, 'invalidId', function (err, post) {
                should.exist(err);
                should.not.exist(post);
                done();
            });

        });
    });
    describe('Deleting post', function () {
        it('should delete the post', function (done) {
            createTestFormWithUser(function (form) {
                var testPost = formSpecUtil.getMockValidPost();
                formLib.createPost(testPost, form._id, function (err, post) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(post);
                    post.form.should.eql(form._id);
                    formLib.getFormById(form._id, function (err, form) {
                        if (err) {
                            return done(err);
                        }
                        should.exist(form);
                        should.exist(form.posts);
                        form.posts.indexOf(post._id).should.not.equal(-1);
                        var postId = post._id;
                        formLib.deletePostById(post._id, function (err, post) {
                            if (err) {
                                return done(err);
                            }
                            should.not.exist(post);
                            formLib.getFormById(form._id, function (err, form) {
                                if (err) {
                                    return done(err);
                                }
                                should.exist(form);
                                should.exist(form.posts);
                                form.posts.indexOf(postId).should.equal(-1);
                                done();
                            });
                        });
                    });
                });

            });
        });
        it('should give an error if the post to be deleted does not exist', function (done) {
            createTestFormWithUser(function (form) {
                should.exist(form);
                var testPost = formSpecUtil.getMockValidPost();
                formLib.createPost(testPost, form._id, function (err, post) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(post);
                    post.form.should.eql(form._id);
                    formLib.getFormById(form._id, function (err, form) {
                        if (err) {
                            return done(err);
                        }
                        should.exist(form);
                        should.exist(form.posts);
                        form.posts.indexOf(post._id).should.not.equal(-1);
                        var postId = post._id;
                        formLib.deletePostById(post._id, function (err, post) {
                            if (err) {
                                return done(err);
                            }
                            should.not.exist(post);
                            formLib.getFormById(form._id, function (err, form) {
                                if (err) {
                                    return done(err);
                                }
                                should.exist(form);
                                should.exist(form.posts);
                                form.posts.indexOf(postId).should.equal(-1);
                                formLib.deletePostById(postId, function (err, post) {
                                    should.exist(err);
                                    should.not.exist(post);
                                    done();
                                });
                            });
                        });
                    });
                });

            });
        });
    });

    describe('Updating a post', function () {
        it('should update an existing post', function (done) {
            createTestFormWithUser(function (form) {
                var testPost = formSpecUtil.getMockValidPost();
                formLib.createPost(testPost, form._id, function (err, post) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(post);
                    formLib.getFormById(form._id, function (err, form) {
                        if (err) {
                            return done(err);
                        }
                        should.exist(form);
                        should.exist(form.posts);
                        form.posts.indexOf(post._id).should.not.equal(-1);
                        formLib.getPostById(form.posts[form.posts.indexOf(post._id)], function (err, post) {
                            if (err) {
                                return done(err);
                            }
                            should.exist(post);
                            var updatingPost = post;
                            updatingPost.name = 'UpdatedName';
                            updatingPost.description = 'UpdatedDescription';
                            updatingPost.icon = 'UpdatedIcon';
                            updatingPost.menuLabel = 'UpdatedMenuLabel';
                            updatingPost.fields = [
                                {},
                                {}
                            ];

                            formLib.updatePost(updatingPost, function (err, post) {
                                if (err) {
                                    return done(err);
                                }
                                should.exist(post);
                                post._id.should.eql(updatingPost._id);
                                post.name.should.equal(updatingPost.name);
                                post.description.should.equal(updatingPost.description);
                                post.icon.should.equal(updatingPost.icon);
                                post.menuLabel.should.equal(updatingPost.menuLabel);
                                post.fields.should.be.instanceof(Array).and.have.lengthOf(updatingPost.fields.length);
                                post.form.should.eql(form._id);
                                done();
                            });
                        });

                    });
                });
            });
        });
    });

    describe('Querying posts', function () {
        it('should find post by Id', function (done) {
            createTestFormWithUser(function (form) {
                var testPost = formSpecUtil.getMockValidPost();
                formLib.createPost(testPost, form._id, function (err, post) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(post);
                    formLib.getFormById(form._id, function (err, form) {
                        if (err) {
                            return done(err);
                        }
                        should.exist(form);
                        should.exist(form.posts);
                        form.posts.indexOf(post._id).should.not.equal(-1);
                        formLib.getPostById(form.posts[form.posts.indexOf(post._id)], function (err, post) {
                            if (err) {
                                return done(err);
                            }
                            should.exist(post);
                            post.name.should.equal(testPost.name);
                            post.description.should.equal(testPost.description);
                            post.icon.should.equal(testPost.icon);
                            post.menuLabel.should.equal(testPost.menuLabel);
                            post.fields.should.be.instanceof(Array).and.have.lengthOf(testPost.fields.length);
                            post.form.should.eql(form._id);
                            done();
                        });
                    });
                });
            });
        });
        it('should not find a post by Id and return an error if post does not exist', function (done) {
            formLib.getPostById('some invalid Id', function (err, post) {
                should.exist(err);
                should.not.exist(post);
                done();
            });
        });
        it('should get all post belonging to a form', function (done) {
            createTestFormWithUser(function (form) {
                var testPost1 = formSpecUtil.getMockValidPost();
                var testPost2 = formSpecUtil.getMockValidPost();
                formLib.createPost(testPost1, form._id, function (err, post1) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(post1);
                    formLib.createPost(testPost2, form._id, function (err, post2) {
                        if (err) {
                            return done(err);
                        }
                        should.exist(post2);
                        formLib.getFormPosts(form._id, function (err, posts) {
                            posts.should.be.instanceof(Array).and.have.lengthOf(2);
                            var lookup = {};
                            for (var i = 0, len = posts.length; i < len; i++) {
                                lookup[posts[i]._id] = posts[i];
                            }
                            var post1Result = lookup[post1._id];
                            var post2Result = lookup[post2._id];
                            should.exist(post1Result);
                            should.exist(post2Result);

                            post1Result.name.should.equal(post1.name);
                            post1Result.description.should.equal(post1.description);
                            post1Result.icon.should.equal(post1.icon);
                            post1Result.menuLabel.should.equal(post1.menuLabel);
                            post1Result.fields.should.be.instanceof(Array).and.have.lengthOf(post1.fields.length);
                            post1Result.form.should.eql(form._id);

                            post2Result.name.should.equal(post2.name);
                            post2Result.description.should.equal(post2.description);
                            post2Result.icon.should.equal(post2.icon);
                            post2Result.menuLabel.should.equal(post2.menuLabel);
                            post2Result.fields.should.be.instanceof(Array).and.have.lengthOf(post2.fields.length);
                            post2Result.form.should.eql(form._id);

                            done();
                        });
                    });
                });
            });
        });
        it('should return an empty array if form has not posts', function (done) {
            createTestFormWithUser(function (form) {
                formLib.getFormPosts(form._id, function (err, posts) {
                    should.not.exist(err);
                    should.exist(posts);
                    posts.should.be.instanceof(Array).and.have.lengthOf(0);
                    done();
                });
            });
        });
        it('should get all posts belonging to a user', function (done) {
            var testUser = userSpecUtil.getMockValidUser();
            userLib.createUser(testUser, function (err, user) {
                if (err) {
                    return done(err);
                }
                should.exist(user);
                createTestFormWithPosts(user._id, function (form) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(form);
                    form.posts.should.be.instanceof(Array).and.have.lengthOf(2);
                    createTestFormWithPosts(user._id, function (form) {
                        if (err) {
                            return done(err);
                        }
                        should.exist(form);
                        form.posts.should.be.instanceof(Array).and.have.lengthOf(2);
                        formLib.getUserPosts(user._id, function (err, posts) {
                            should.not.exist(err);
                            should.exist(posts);
                            posts.should.be.instanceof(Array).and.have.lengthOf(4);
                            done();
                        });
                    });
                });
            });
        });
        it('should return an empty array if a user has no posts', function (done) {
                createTestFormWithUser(function (form) {
                    formLib.getUserPosts(form.owner, function (err, posts) {
                        should.not.exist(err);
                        should.exist(posts);
                        posts.should.be.instanceof(Array).and.have.lengthOf(0);
                        done();
                    });
                });
        });
        it('should get all posts related to a folder', function (done) {
            var testUser = userSpecUtil.getMockValidUser();
            userLib.createUser(testUser, function (err, user) {
                if (err) {
                    return done(err);
                }
                should.exist(user);
                createTestFormWithPosts(user._id, function (form) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(form);
                    form.posts.should.be.instanceof(Array).and.have.lengthOf(2);
                    createTestFormWithPosts(user._id, function (form) {
                        if (err) {
                            return done(err);
                        }
                        should.exist(form);
                        form.posts.should.be.instanceof(Array).and.have.lengthOf(2);
                        formLib.getFolderPosts(user.folder, function (err, posts) {
                            should.not.exist(err);
                            should.exist(posts);
                            posts.should.be.instanceof(Array).and.have.lengthOf(4);
                            done();
                        });
                    });
                });
            });
        });
        it('should return an empty array if folder has no posts', function (done) {
            var testUser = userSpecUtil.getMockValidUser();
            userLib.createUser(testUser, function (err, user) {
                if (err) {
                    return done(err);
                }
                should.exist(user);
                formLib.getFolderPosts(user.folder, function (err, posts) {
                    should.not.exist(err);
                    should.exist(posts);
                    posts.should.be.instanceof(Array).and.have.lengthOf(0);
                    done();
                });
            });
        });
    });
});