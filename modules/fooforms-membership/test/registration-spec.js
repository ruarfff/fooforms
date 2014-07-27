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

describe('Registration', function () {

    // Happy path
    describe('a valid application', function () {
        var regResult = {};
        var displayName = 'name';
        var email = 'user@test.com';
        var password = 'pass';
        var confirmPass = 'pass';

        before(function (done) {
            mockgoose.reset();
            var registration = new Registration();
            registration.register({email: email, displayName: displayName,
                    password: password, confirmPass: confirmPass},
                function (err, result) {
                    regResult = result;
                    done(err);
                });
        });

        after(function () {
            mockgoose.reset();
        });

        it('is successful', function () {
            (regResult.success).should.equal(true);
        });
        it('creates a user', function () {
            should.exist(regResult.user);
        });
        it('registered user has a sign in count of 1', function () {
            regResult.user.signInCount.should.equal(1);
        });
        it('registered user last login date set', function () {
            should.exist(regResult.user.lastLogin);
        });
        it('registered user has a salt', function () {
            should.exist(regResult.user.salt);
        });
        it('registered user password is encrypted', function () {
            // Bit of a rough check
            regResult.user.password.should.not.equal(password);
        });
        it('result has a success message', function () {
            regResult.message.should.equal('Successfully registered');
        });
    });

    describe('an empty or null email', function () {
        var registration = null;
        var displayName = 'name';
        var password = 'pass';
        var confirmPass = 'pass';

        before(function () {
            mockgoose.reset();
            registration = new Registration();
        });

        after(function () {
            mockgoose.reset();
        });

        it('is not successful', function (done) {
            registration.register({displayName: displayName,
                    password: password, confirmPass: confirmPass},
                function (err, result) {
                    should.not.exist(err);
                    result.success.should.equal(false);
                    done();
                });
        });
        it('tells the user that email is required when email is null', function (done) {
            registration.register({displayName: displayName,
                    password: password, confirmPass: confirmPass},
                function (err, result) {
                    should.not.exist(err);
                    result.message.should.equal('Email, username and password are required');
                    done();
                });
        });
        it('tells the user that email is required when email is empty', function (done) {
            registration.register({displayName: displayName,
                    password: password, confirmPass: confirmPass, email: ''},
                function (err, result) {
                    should.not.exist(err);
                    result.message.should.equal('Email, username and password are required');
                    done();
                });
        });
    });

    describe('empty or null password', function () {
        var regResult = {};
        var displayName = 'name';
        var email = 'user@test.com';

        before(function (done) {
            mockgoose.reset();
            var registration = new Registration();
            registration.register({email: email, displayName: displayName},
                function (err, result) {
                    regResult = result;
                    done(err);
                });
        });

        after(function () {
            mockgoose.reset();
        });

        it('is not successful', function () {
            (regResult.success).should.equal(false);
        });
        it('does not have a user', function () {
            should.not.exist(regResult.user);
        });
        it('tells the user that password is required', function () {
            regResult.message.should.equal('Email, username and password are required');
        });
    });

    describe('password and confirm mismatch', function () {
        var regResult = {};
        var displayName = 'name';
        var email = 'user@test.com';
        var password = 'pass';
        var confirmPass = 'pass2';

        before(function (done) {
            mockgoose.reset();
            var registration = new Registration();
            registration.register({email: email, displayName: displayName,
                    password: password, confirmPass: confirmPass},
                function (err, result) {
                    regResult = result;
                    done(err);
                });
        });

        after(function () {
            mockgoose.reset();
        });
        it('is not successful', function () {
            (regResult.success).should.equal(false);
        });
        it('does not have a user', function () {
            should.not.exist(regResult.user);
        });
        it('tells the user that passwords must match', function () {
            regResult.message.should.equal('Password do not match');
        });
    });

    describe('emails already exist', function () {
        var regResult = {};
        var displayName = 'name';
        var displayName2 = 'name2';
        var email = 'user@test.com';
        var password = 'pass';
        var confirmPass = 'pass';

        before(function (done) {
            mockgoose.reset();
            var registration = new Registration();
            registration.register({email: email, displayName: displayName,
                    password: password, confirmPass: confirmPass},
                function (err, result) {
                    if (err) {
                        done(err);
                    }
                    assert.ok(result.success);
                    registration.register({email: email, displayName: displayName2,
                            password: password, confirmPass: confirmPass},
                        function (err, result) {
                            regResult = result;
                            done(err);
                        });
                });
        });

        after(function () {
            mockgoose.reset();
        });
        it('is not successful', function () {
            (regResult.success).should.equal(false);
        });
        it('does not have a user', function () {
            should.not.exist(regResult.user);
        });
        it('tells the user that user already exists', function () {
            regResult.message.should.equal('User already exists');
        });
    });

    describe('user already exists', function () {
        var regResult = {};
        var displayName = 'name';
        var email = 'user@test.com';
        var email2 = 'user2@test.com';
        var password = 'pass';
        var confirmPass = 'pass';

        before(function (done) {
            mockgoose.reset();
            var registration = new Registration();
            registration.register({email: email, displayName: displayName,
                    password: password, confirmPass: confirmPass},
                function (err, result) {
                    if (err) {
                        done(err);
                    }
                    assert.ok(result.success);
                    registration.register({email: email2, displayName: displayName,
                            password: password, confirmPass: confirmPass},
                        function (err, result) {
                            regResult = result;
                            done(err);
                        });
                });
        });

        after(function () {
            mockgoose.reset();
        });
        it('is not successful', function () {
            (regResult.success).should.equal(false);
        });
        it('does not have a user', function () {
            should.not.exist(regResult.user);
        });
        it('tells the user that user already exists', function () {
            regResult.message.should.equal('User already exists');
        });
    });
});
