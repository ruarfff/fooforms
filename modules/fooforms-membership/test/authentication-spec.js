/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var should = require('should');
var assert = require('assert');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId();
// Nasty hack for testing with mocha -w ... see: https://github.com/LearnBoost/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

var mockgoose = require('mockgoose');
mockgoose(mongoose);

var Registration = require('../lib/registration');
var Authentication = require('../lib/authentication');

describe('Authentication', function () {
    var auth = {};
    var displayName = 'name';
    var email = 'user@test.com';
    var password = 'pass';
    var confirmPass = 'pass';

    before(function (done) {
        mockgoose.reset();
        var registration = new Registration();
        auth = new Authentication();
        registration.register({email: email, displayName: displayName,
                password: password, confirmPass: confirmPass},
            function (err, result) {
                assert.ok(result.success);
                done(err);
            });
    });

    after(function () {
        mockgoose.reset();
    });

    describe('a valid login with displayName', function () {
        var authResult = {};

        before(function (done) {
            auth.authenticate({username: displayName, password: password}, function (err, result) {
                authResult = result;
                done(err);
            });
        });
        it('is successful', function () {
            authResult.success.should.equal(true);
        });
        it('returns a user', function () {
            should.exist(authResult.user);
        });
        it('updates user stats', function () {
            authResult.user.signInCount.should.equal(2);
            should.exist(authResult.user.lastLogin);
        });
    });

    describe('a valid login with email', function () {
        var authResult = {};

        before(function (done) {
            auth.authenticate({username: email, password: password}, function (err, result) {
                authResult = result;
                done(err);
            });
        });
        it('is successful', function () {
            authResult.success.should.equal(true);
        });
        it('returns a user', function () {
            should.exist(authResult.user);
        });
    });

    describe('an empty email or username', function () {
        var authResult = {};

        before(function (done) {
            auth.authenticate({username: '', password: password}, function (err, result) {
                authResult = result;
                done(err);
            });
        });

        it('is not successful', function () {
            authResult.success.should.equal(false);
        });
        it('returns a message saying invalid login', function () {
            authResult.message.should.equal('Invalid login');
        });
    });

    describe('an empty password', function () {
        var authResult = {};

        before(function (done) {
            auth.authenticate({username: displayName, password: ''}, function (err, result) {
                authResult = result;
                done(err);
            });
        });

        it('is not successful', function () {
            authResult.success.should.equal(false);
        });
        it('returns a message saying invalid login', function () {
            authResult.message.should.equal('Invalid login');
        });
    });

    describe('an invalid password', function () {
        var authResult = {};

        before(function (done) {
            auth.authenticate({username: displayName, password: 'jkhkjh'}, function (err, result) {
                authResult = result;
                done(err);
            });
        });

        it('is not successful', function () {
            authResult.success.should.equal(false);
        });
        it('returns a message saying invalid login', function () {
            authResult.message.should.equal('Invalid login');
        });
    });

    describe('user not found', function () {
        var authResult = {};

        before(function (done) {
            auth.authenticate({username: 'some user', password: ''}, function (err, result) {
                authResult = result;
                done(err);
            });
        });

        it('is not successful', function () {
            authResult.success.should.equal(false);
        });
        it('returns a message saying invalid login', function () {
            authResult.message.should.equal('Invalid login');
        });
    });

});