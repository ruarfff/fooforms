var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var log = require('fooforms-logging').LOG;
var stringUtil = require('fooforms-rest').stringUtil;
var statusCodes = require('fooforms-rest').statusCodes;
var userProfile = require('../lib/userProfile');
var membership = new Membership(db);


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
    if(displayName) {
        displayName = stringUtil.escapeRegExpChars(displayName);
        membership.searchUsers({displayName: new RegExp('^' + displayName , 'i')}, function (err, result) {
            if (err) {
                next(err);
            }
            var userPartials = [];

            result.data.forEach(function (user) {
                var userPart = {
                    _id: user._id,
                    displayName: user.displayName,
                    photo: user.photo
                };
                userPartials.push(userPart);
            });

            res.status(statusCodes.OK).json(userPartials);

        });
    } else {
        res.status(statusCodes.OK).json([]);
    }
};

exports.updateUser = function (req, res, next) {
    membership.updateUser(req.body, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            res.send(result.user);
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result.message);
        }
    });
};
