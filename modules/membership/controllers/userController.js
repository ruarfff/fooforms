var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var log = require('fooforms-logging').LOG;
var stringUtil = require('fooforms-rest').stringUtil;
var statusCodes = require('fooforms-rest').statusCodes;
var slug = require('slug');
var userProfile = require('../lib/userProfile');
var membership = new Membership(db);
var _ = require('lodash');


exports.findUserById = function (req, res, next) {
    membership.findUserById(req.params.user, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            res.send(userProfile.userToProfile(result.data));
        } else {
            res.status(statusCodes.NOT_FOUND).json('User not found');
        }
    });
};

exports.listByUserName = function (req, res, next) {
    var displayName = req.query.username || '';
    if (displayName) {
        displayName = stringUtil.escapeRegExpChars(displayName);
        membership.searchUsers({displayName: new RegExp('^' + displayName, 'i')}, function (err, result) {
            if (err) {
                next(err);
            }
            var userProfiles = [];

            result.data.forEach(function (user) {
                userProfiles.push(userProfile.userToProfile(user));
            });
            res.status(statusCodes.OK).json(userProfiles);

        });
    } else {
        res.status(statusCodes.OK).json([]);
    }
};

exports.updateUser = function (req, res, next) {
    // Depopulate arrays, TODO: this sucks
    if (req.body) {
        if (req.body.displayName) {
            req.body.displayName = slug(req.body.displayName);
        }
        if (req.body.organisations && req.body.organisations[0]._id) {
            req.body.organisations = _.pluck(req.body.organisations, "_id")
        }
        if (req.body.teams && req.body.teams[0]._id) {
            req.body.teams = _.pluck(req.body.teams, "_id")
        }
        if (req.body.folders && req.body.folders[0]._id) {
            req.body.folders = _.pluck(req.body.folders, "_id")
        }
    }

    membership.updateUser(req.body, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            res.send(userProfile.userToProfile(result.user));
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result.message);
        }
    });
};

