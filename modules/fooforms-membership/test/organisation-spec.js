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

var Organisation = require('../models/organisation');

describe('Organisation', function () {
    // Happy path
    describe('initialising organisation with defaults', function () {
        var organisation = {};

        var displayName = 'organisation';
        var billingEmail = 'org@test.com';
        var owners = [ObjectId];


        before(function (done) {
            mockgoose.reset();
            var testOrganisation = new Organisation({displayName: displayName,
                billingEmail: billingEmail, owners: owners});
            testOrganisation.save(function (err, savedOrganisation) {
                organisation = savedOrganisation;
                done(err);
            });
        });

        after(function () {
            mockgoose.reset();
        });

        it('displayName is ' + displayName, function () {
           organisation.displayName.should.equal(displayName);
        });
        it('billing email is ' + billingEmail, function () {
           organisation.billingEmail.should.equal(billingEmail);
        });
        it('has owners', function () {
            should.exist(organisation.owners);
        });
        it('has a created date', function () {
            organisation.created.should.be.instanceof(Date);
            should.exist(organisation.created);
        });
        it('has a last modified date', function () {
            organisation.lastModified.should.be.instanceof(Date);
            should.exist(organisation.lastModified);
        });
        it('has no name', function () {
            should.not.exist(organisation.name);
        });
        it('has no domain', function () {
            should.not.exist(organisation.domain);
        });
        it('has no email', function () {
            should.not.exist(organisation.email);
        });
        it('has no photo', function () {
            should.not.exist(organisation.photo);
        });
        it('has no forms', function () {
           organisation.forms.length.should.equal(0);
        });
        it('has no teams', function () {
           organisation.teams.length.should.equal(0);
        });
    });

    describe('initialising organisation with some values realistic', function () {
        var organisation = {};

        var displayName = 'organisation';
        var billingEmail = 'org@test.com';
        var owners = [ObjectId];
        var name = 'org name';
        var domain = 'org.domain.com';
        var email = 'org@email.com';
        var photo = 'http:/photo/aphoto';
        var forms = [ObjectId, ObjectId];
        var teams = [ObjectId, ObjectId, ObjectId];

        before(function (done) {
            mockgoose.reset();
            var testOrganisation = new Organisation({displayName: displayName,
                billingEmail: billingEmail, owners: owners, name: name,
                domain: domain, email: email, photo: photo, forms: forms,
                teams: teams});
            testOrganisation.save(function (err, savedOrganisation) {
                organisation = savedOrganisation;
                done(err);
            });
        });

        after(function () {
            mockgoose.reset();
        });

        it('displayName is ' + displayName, function () {
            organisation.displayName.should.equal(displayName);
        });
        it('billing email is ' + billingEmail, function () {
            organisation.billingEmail.should.equal(billingEmail);
        });
        it('has owners', function () {
            should.exist(organisation.owners);
        });
        it('has a created date', function () {
            organisation.created.should.be.instanceof(Date);
            should.exist(organisation.created);
        });
        it('has a last modified date', function () {
            organisation.lastModified.should.be.instanceof(Date);
            should.exist(organisation.lastModified);
        });
        it('has the  name: ' + name, function () {
            organisation.name.should.equal(name);
        });
        it('has the domain: ' + domain, function () {
            organisation.domain.should.equal(domain);
        });
        it('has the email: ' + email, function () {
            organisation.email.should.equal(email);
        });
        it('has the photo: ' + photo, function () {
            organisation.photo.should.equal(photo);
        });
        it('has ' + forms.length + ' forms', function () {
            organisation.forms.length.should.equal(forms.length);
        });
        it('has ' + teams.length + ' teams', function () {
            organisation.teams.length.should.equal(teams.length);
        });
    });

    describe('initialising organisation with no owners', function () {
        var organisation = {};

        var displayName = 'organisation';
        var billingEmail = 'org@test.com';


        before(function () {
            mockgoose.reset();
            organisation = new Organisation({displayName: displayName,
                billingEmail: billingEmail});
        });

        after(function () {
            mockgoose.reset();
        });

        it('should not save and returns an error', function (done) {
            organisation.save(function (err, savedOrganisation) {
                should.exist(err);
                should.not.exist(savedOrganisation);
                err.errors.owners.path.should.equal('owners');
                err.errors.owners.type.should.equal('required');
                done();
            });
        });
    });

    describe('initialising organisation with no displayName', function () {
        var organisation = {};

        var billingEmail = 'org@test.com';
        var owners = [ObjectId];

        before(function () {
            mockgoose.reset();
            organisation = new Organisation({owners: owners,
                billingEmail: billingEmail});
        });

        after(function () {
            mockgoose.reset();
        });

        it('should not save and returns an error', function (done) {
            organisation.save(function (err, savedOrganisation) {
                should.exist(err);
                should.not.exist(savedOrganisation);
                err.errors.displayName.path.should.equal('displayName');
                err.errors.displayName.type.should.equal('required');
                done();
            });
        });
    });

    describe('initialising organisation with no billing email', function () {
        var organisation = {};

        var displayName = 'organisation';
        var owners = [ObjectId];

        before(function () {
            mockgoose.reset();
            organisation = new Organisation({owners: owners,
                displayName: displayName});
        });

        after(function () {
            mockgoose.reset();
        });

        it('should not save and returns an error', function (done) {
            organisation.save(function (err, savedOrganisation) {
                should.exist(err);
                should.not.exist(savedOrganisation);
                err.errors.billingEmail.path.should.equal('billingEmail');
                err.errors.billingEmail.type.should.equal('required');
                done();
            });
        });
    });
});