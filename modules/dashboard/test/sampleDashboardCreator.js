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
    var formFields = [
        {},
        {},
        {}
    ];
    var formPostStream = ObjectId;
    var formOwner = ObjectId;
    var commentStream = ObjectId;

    var commentContent = 'a comment';
    var commentCommenter = ObjectId;

    var sampleUser = { email: email, displayName: displayName,
        password: password, confirmPass: confirmPass, organisationName: organisationName };
    var sampleForm = {
        displayName: formDisplayName, title: formTitle, icon: formIcon,
        description: formDescription, btnLabel: formBtnLabel,
        settings: formSettings, fields: formFields, formEvents: formEvents,
        postStream: formPostStream, owner: formOwner
    };
    var samplePost = {
        postStream: formPostStream, name: formDisplayName,
        icon: formIcon, commentStream: commentStream, fields: formFields
    };
    var sampleComment = {
        commentStream: commentStream, content: commentContent, commenter: commentCommenter
    };
    fooForm.createForm(sampleForm, function (err, formResultA) {
        should.not.exist(err);
        assert.ok(formResultA.success);
        fooForm.createForm(sampleForm, function (err, formResultB) {
            should.not.exist(err);
            assert.ok(formResultB.success);
            samplePost.postStream = formResultA.form.postStreams[0];
            fooForm.createPost(samplePost, function (err, postResultA) {
                should.not.exist(err);
                assert.ok(postResultA.success);
                samplePost.postStream = formResultA.form.postStreams[0];
                fooForm.createPost(samplePost, function (err, postResultB) {
                    should.not.exist(err);
                    assert.ok(postResultB.success);
                    sampleComment.commentStream = postResultA.post.commentStreams[0];
                    fooForm.createComment(sampleComment, function (err, result) {
                        should.not.exist(err);
                        assert.ok(result.success);
                        membership.register(sampleUser, function (err, result) {
                            assert.ok(result.success);
                            var user = result.user;
                            user.forms.push(formResultB.form._id);
                            membership.updateUser(user, function (err, result) {
                                should.not.exist(err);
                                assert.ok(result.success);
                                membership.Organisation.populate(result.user, {path: 'organisations'}, function (err, docs) {
                                    should.not.exist(err);
                                    membership.Team.populate(result.user, {path: 'teams'}, function (err, docs) {
                                        next(err, testData);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

    });

};
