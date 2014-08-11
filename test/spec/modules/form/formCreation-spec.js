/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../spec-util');
var formSpecUtil = require('./form-spec-util');
var userSpecUtil = require('../user/user-spec-util');

describe('Form creation functions', function () {
    var formLib;
    var userLib;


    before(function () {
        formLib = require(global.config.modules.FORM);
        userLib = require(global.config.modules.USER);
    });

    afterEach(function () {
        specUtil.dropDatabase();
    });


    describe('Creating a form', function () {
        it('with valid entries should save without error', function (done) {
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
                    form.folder.should.eql(user.folder);
                    form.name.should.equal(testForm.name);
                    form.icon.should.equal(testForm.icon);
                    form.description.should.equal(testForm.description);
                    form.menuLabel.should.equal(testForm.menuLabel);
                    form.btnLabel.should.equal(testForm.btnLabel);
                    form.settings.should.eql(testForm.settings);
                    form.fields.should.be.instanceof(Array).and.have.lengthOf(testForm.fields.length);
                    done();
                });
            });
        });
        it('with invalid entries should not save and report an error', function (done) {
            var testForm = formSpecUtil.getMockInvalidForm();
            formLib.createForm(testForm, function (err, form) {
                should.exist(err);
                should.not.exist(form);
                done();
            });
        });
    });


});