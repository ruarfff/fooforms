var log = require('fooforms-logging').LOG;
var FooForm = require('fooforms-forms');
var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var statusCodes = require('fooforms-rest').statusCodes;
var errorHandler = require('fooforms-rest').errorResponseHandler;
var paginate = require('express-paginate');
var fooForm = new FooForm(db);
var membership = new Membership(db);

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
            populateForms({user: user, model: 'organisations'}, function (err, user) {
                if (err) {
                    return next(err);
                }
                user.defaultFolder = user.folders[0];
                for (var i = 0; i < user.organisations.length; i++) {
                    user.organisations[i].defaultFolder = user.organisations[i].folders[0];
                }
                res.status(statusCodes.OK).send(user);
            });
        });
    });
};

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
        }, { sortBy: { lastModified: -1 } });
};
