/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../spec-util');
var formSpecUtil = require('./form-spec-util');
var userSpecUtil = require('../user/user-spec-util');
var log = require(global.config.modules.LOGGING).LOG;

describe('Form deletion', function () {
    var formLib;
    var userLib;

    before(function () {
        formLib = require(global.config.modules.FORM);
        userLib = require(global.config.modules.USER);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });


    describe('Deleting a form', function () {
        it('should delete a form and all associated posts', function (done) {
            var testUser = userSpecUtil.getMockValidUser();
            userLib.createUser(testUser, function (err, user) {
                if (err) {
                    return done(err);
                }
                should.exist(user);
                var testForm = formSpecUtil.getMockValidForm();
                testForm.owner = user._id;
                formLib.createForm(testForm, function (err, form) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(form);
                    form.owner.should.eql(user._id);
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
                            formLib.getFormById(form._id, function (err, form) {
                                if (err) {
                                    return done(err);
                                }
                                should.exist(form);
                                formLib.deleteFormById(form._id, function (err, form) {
                                    if (err) {
                                        return done(err);
                                    }
                                    should.not.exist(form);
                                    formLib.getPostById(post1._id, function (err, post) {
                                        if (err) {
                                            return done(err);
                                        }
                                        should.not.exist(post);
                                        formLib.getPostById(post2._id, function (err, post) {
                                            if (err) {
                                                return done(err);
                                            }
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
        });
    });

});