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

var Membership = require('../index');

describe('Membership', function () {

    var membership = new Membership();

    describe('authentication', function () {
        var newUser = {};
        var displayName = 'user';
        var email = 'user@email.com';
        var password = 'somegreatpassword';
        before(function (done) {
            mockgoose.reset();
            membership.register({displayName: displayName, email: email, password: password}, function (err, result) {
                newUser = result.user;
                assert.ok(result.success, 'error in registration');
                done();
            });

        });
        after(function () {
            mockgoose.reset();
        });

        it('successfully authenticates', function (done) {
            membership.authenticate(email, password, function (err, result) {
                result.success.should.equal(true);
                done(err);
            });
        });
    });
});