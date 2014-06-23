/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../spec-util');
var formSpecUtil = require('./form-spec-util');
var userSpecUtil = require('../user/user-spec-util');

describe('Form updating', function () {
    var formLib;
    var userLib;

    before(function () {
        formLib = require(global.config.modules.FORM);
        userLib = require(global.config.modules.USER);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });


    describe('Update a form', function () {
        it('should update a form if it exists', function (done) {
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
                    var newFormContent = formSpecUtil.getMockValidForm();
                    form.name = newFormContent.name;
                    form.icon = newFormContent.icon;
                    form.btnLabel = newFormContent.btnLabel;
                    form.description = newFormContent.description;
                    form.menuLabel = newFormContent.menuLabel;
                    form.fields = newFormContent.fields;
                    form.formEvents = newFormContent.formEvents;
                    form.sharing = newFormContent.sharing;
                    form.privileges = newFormContent.privileges;

                    formLib.updateForm(form, function (err, updatedForm) {
                        should.not.exist(err);
                        should.exist(updatedForm);
                        updatedForm.name.should.equal(newFormContent.name);
                        updatedForm.icon.should.equal(newFormContent.icon);
                        updatedForm.btnLabel.should.equal(newFormContent.btnLabel);
                        updatedForm.description.should.equal(newFormContent.description);
                        updatedForm.menuLabel.should.equal(newFormContent.menuLabel);
                        updatedForm.should.have.property('fields').with.lengthOf(newFormContent.fields.length);
                        updatedForm.should.have.property('formEvents').with.lengthOf(newFormContent.formEvents.length);
                        updatedForm.sharing.should.eql(newFormContent.sharing);
                        updatedForm.privileges.should.equal(newFormContent.privileges);
                        done();
                    });
                });
            });
        });
    });

});