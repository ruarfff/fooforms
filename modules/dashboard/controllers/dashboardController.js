var log = require('fooforms-logging').LOG;
var FooForm = require('fooforms-forms');
var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var statusCodes = require('fooforms-rest').statusCodes;
var errorHandler = require('fooforms-rest').errorResponseHandler;
var paginate = require('express-paginate');
var fooForm = new FooForm(db);
var membership = new Membership(db);
var userProfile = require('../../membership/lib/userProfile');
var _ = require('lodash');

// TODO: This is just terrible.... but works. Refactor when not in get the thing out the door mode.
var populateForms = function (args, next) {
    var user = args.user;
    var model = '';
    if (args.model) {
        model = args.model + '.';
    }

    membership.User.populate(user, {path: model + 'folders', model: 'Folder'}, function (err, user) {
        if (err) {
            return next(err);
        }
        membership.User.populate(user, {path: model + 'folders.forms', model: 'Form'}, function (err, user) {
            return next(err, user);
        });
    });
};


exports.getUserDashboard = function (req, res, next) {
    var userId = req.params.user;

    membership.User.findById(userId).lean().populate('organisations teams').exec(function (err, doc) {
        if (err) {
            return next(err);
        }
        if (!doc) {
            res.status(statusCodes.NOT_FOUND);
        }

        populateForms({user: doc}, function (err, user) {
            if (err) {
                return next(err);
            }
            populateForms({user: user, model: 'teams'}, function (err, user) {
                if (err) {
                    return next(err);
                }
                var i;
                for (i = 0; i < user.organisations.length; i++) {
                    user.organisations[i].defaultFolder = user.organisations[i].folders[0];
                }
                for (i = 0; i < user.teams.length; i++) {
                    user.teams[i].defaultFolder = user.teams[i].folders[0];
                }
                res.status(statusCodes.OK).send(userProfile.userToProfile(user));
            });
        });
    });
};

// TODO: Remove this. No longer used but the test that runs against it is handy for now.
// Will refactor to have the test run against the function in the forms module.
exports.getDashboardPosts = function (req, res, next) {
    var postStreams = req.query.postStreams.split(',');
    fooForm.Post
        .paginate({postStream: {$in: postStreams}}, req.query.page, req.query.limit, function (err, pageCount, docs, itemCount) {
            if (err) {
                next(err);
            }
            res.json({
                object: 'list',
                has_more: paginate.hasNextPages(req)(pageCount),
                data: docs
            });
        }, {populate: 'commentStreams commentStreams.comments'}, {sortBy: {lastModified: -1}});
};
