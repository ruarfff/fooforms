var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId();
var FooForm = require('fooforms-forms');
var Membership = require('fooforms-membership');

var should = require('should');
var assert = require('assert');

exports.generateDashboardTestData = function (db, next) {
    var fooForm = new FooForm(db);
    var membership = new Membership(db);
    var testData = {};

    var displayName = 'name';
    var email = 'user@test.com';
    var password = 'pass';
    var confirmPass = 'pass';
    var organisationName = 'fooforms';
    var formDisplayName = 'form';
    var formTitle = 'form title';
    var formIcon = 'www.fooforms.com/icon.png';
    var formDescription = 'the form description';
    var formBtnLabel = 'the button label';
    var formEvents = [
        {}
    ];
    var formSettings = {"setting": {}, "something": [], "something-else": "test"};
    var fields = [
        {"something": {}},
        {"somethingElse": "test"},
        {},
        {}
    ];

    var commentContent = 'a comment';

    var sampleUser = { email: email, displayName: displayName,
        password: password, confirmPass: confirmPass, organisationName: organisationName };
    var sampleForm = {
        displayName: formDisplayName, title: formTitle, icon: formIcon,
        description: formDescription, btnLabel: formBtnLabel,
        settings: formSettings, fields: fields, formEvents: formEvents
    };
    var samplePost = {
        name: formDisplayName,
        icon: formIcon, fields: fields
    };
    var sampleComment = {
        content: commentContent
    };

    //TODO: Dear God!!
    membership.register(sampleUser, function (err, result) {
        assert.ok(result.success);
        var user = result.user;
        var org = result.organisation;
        sampleForm.owner = org._id;
        fooForm.createForm(sampleForm, function (err, formResultA) {
            should.not.exist(err);
            assert.ok(formResultA.success);
            sampleForm.owner = user._id;
            fooForm.createForm(sampleForm, function (err, formResultB) {
                should.not.exist(err);
                assert.ok(formResultB.success);
                samplePost.postStream = formResultA.form.postStreams[0];
                samplePost.createdBy = user._id;
                fooForm.createPost(samplePost, function (err, postResultA) {
                    should.not.exist(err);
                    assert.ok(postResultA.success);
                    samplePost.postStream = formResultB.form.postStreams[0];
                    samplePost.createdBy = user._id;
                    fooForm.createPost(samplePost, function (err, postResultB) {
                        should.not.exist(err);
                        assert.ok(postResultB.success);
                        sampleComment.commentStream = postResultA.post.commentStreams[0];
                        sampleComment.commenter = user._id;
                        fooForm.createComment(sampleComment, function (err, result) {
                            should.not.exist(err);
                            assert.ok(result.success);
                            user.forms.push(formResultB.form._id);
                            org.forms.push(formResultA.form._id);
                            membership.updateUser(user, function (err, userUpdateResult) {
                                should.not.exist(err);
                                assert.ok(userUpdateResult.success);
                                membership.updateOrganisation(org, function (err, orgUpdateResult) {
                                    should.not.exist(err);
                                    assert.ok(orgUpdateResult.success);
                                    userUpdateResult.user.organisations[0] = orgUpdateResult.organisation;
                                    testData = userUpdateResult.user;
                                    next(testData);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};
