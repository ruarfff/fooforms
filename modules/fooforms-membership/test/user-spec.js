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

var User = require('../models/user');


describe('User', function () {
    // Happy path
    describe('initialising a user with defaults', function () {
        var user = {};

        var email = 'user@test.com';
        var displayName = 'user';
        var password = 'somecrappass';
        var teams = [ObjectId];


        before(function (done) {
            mockgoose.reset();
            var testUser = new User({email: email, displayName: displayName,
                password: password, teams: teams});
            testUser.save(function (err, savedUser) {
                user = savedUser;
                done(err);
            });
        });

        after(function () {
            mockgoose.reset();
        });

        it('displayname is' + displayName, function () {
            user.displayName.should.equal(displayName);
        });
        it('emails is ' + email, function () {
            user.email.should.equal(email);
        });
        it('has a pending status', function () {
            user.status.should.equal('pending');
        });
        it('has a created date', function () {
            user.created.should.be.instanceof(Date);
            should.exist(user.created);
        });
        it('has a last modified date', function () {
            user.lastModified.should.be.instanceof(Date);
            should.exist(user.lastModified);
        });
        it('has a signInCount of 0', function () {
            user.signInCount.should.equal(0);
        });
        it('has no lastLogin', function () {
            should.not.exist(user.lastLogin);
        });
        it('has no name', function () {
            user.name.should.have.properties('familyName', 'givenName', 'middleName');
            should.not.exist(user.name.familyName);
            should.not.exist(user.name.givenName);
            should.not.exist(user.name.middleName);
        });
        it('has a password', function () {
            // Bit of a rough test
            user.password.should.equal(password);
        });
        it('has no photo', function () {
            should.not.exist(user.photo);
        });
        it('has a default local provider', function () {
            user.provider.should.equal('local');
        });
        it('has one team', function () {
            user.teams.length.should.equal(1);
        });
        it('has no forms', function () {
            user.forms.length.should.equal(0);
        });
        it('is not admin', function () {
            user.admin.should.equal(false);
        });
    });

    describe('initialising User with most values (similar to a standard registration)', function () {
        var user = {};

        var email = 'user@test.com';
        var displayName = 'user';
        var password = 'somecrappass';
        var teams = [ObjectId];
        var givenName = 'given';
        var middleName = 'middle';
        var familyName = 'family';
        var photo = 'someurl';

        before(function (done) {
            mockgoose.reset();
            var testUser = new User({name: {givenName: givenName, middleName: middleName, familyName: familyName},
                email: email, displayName: displayName, password: password, teams: teams,
                photo: photo});
            testUser.save(function (err, savedUser) {
                user = savedUser;
                done(err);
            });
        });

        after(function () {
            mockgoose.reset();
        });

        it('has a valid name', function () {
            user.name.givenName.should.equal(givenName);
            user.name.familyName.should.equal(familyName);
            user.name.middleName.should.equal(middleName);
        });
        it('has a photo', function () {
            user.photo.should.equal(photo);
        });

    });

    describe('initializing user with invalid password', function () {
        var user = {};

        var email = 'user@test.com';
        var displayName = 'user';
        var teams = [ObjectId];

        beforeEach(function () {
            mockgoose.reset();
            user = new User({email: email, displayName: displayName, teams: teams});
        });

        after(function () {
            mockgoose.reset();
        });

        it('throws an error on save with invalid password message when no password provided', function (done) {
            user.save(function (err, savedUser) {
                should.exist(err);
                should.not.exist(savedUser);
                err.message.should.equal('Invalid password');
                done();
            });
        });
        it('throws an error on save with password cannot be blank message when empty password provided', function (done) {
            user.password = '';
            user.save(function (err, savedUser) {
                should.exist(err);
                should.not.exist(savedUser);
                err.errors.password.message.should.equal('Password cannot be blank');
                done();
            });
        });

    });
/**
    describe('initializing a user with no team', function () {
        var user = {};

        var email = 'user@test.com';
        var displayName = 'user';
        var password = 'somecrappass';



        beforeEach(function () {
            mockgoose.reset();
            user = new User({email: email, displayName: displayName, password: password});
        });

        after(function () {
            mockgoose.reset();
        });

        it('throws an error when no team is saved', function (done) {
            user.save(function (err, savedUser) {
                should.exist(err);
                should.not.exist(savedUser);
                err.errors.teams.message.should.equal('Error saving user. Must be a member of a team.');
                done();
            });
        });
        it('throws an error if an empty team list is saved', function (done) {
            user.teams = [];
            user.save(function (err, savedUser) {
                should.exist(err);
                should.not.exist(savedUser);
                err.errors.teams.message.should.equal('Error saving user. Must be a member of a team.');
                done();
            });

        });
    });*/

});


