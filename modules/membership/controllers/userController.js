var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var log = require('fooforms-logging').LOG;
var stringUtil = require('fooforms-rest').stringUtil;
var statusCodes = require('fooforms-rest').statusCodes;
var userProfile = require('../lib/userProfile');
var membership = new Membership(db);


exports.findUserById = function (req, res, next) {
    membership.findUserById(req.params.user, function (err, result) {
        if(err){next(err);}
        if (result.success) {
            res.send(userProfile.userToProfile(result.data));
        } else {
            res.status(statusCodes.NOT_FOUND).json('User not found');
        }
    });
};

exports.listByUserName = function (req, res, next) {
    var displayName = req.query.username || '';
    membership.searchUsers({displayName: new RegExp('^' + stringUtil.escapeRegExpChars(displayName), 'i')}, function (err, result) {
        if(err) {
            next(err);
        }
        var userPartials = [];

        result.data.forEach(function (user) {
            var userPart = {
                displayName: user.displayName,
                photo: user.photo
            };
            userPartials.push(userPart);
        });

        res.status(statusCodes.OK).json(userPartials);

    });
};

exports.updateUser = function (req, res, next) {
    membership.updateUser(req.body, function (err, result) {
       if(err){next(err);}
        if(result.success) {
            res.send(result.user);
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result.message);
        }
    });
};

exports.checkUserName = function (req, res, next) {
    membership.checkDisplayNameExists(req.params.username, function (err, exists) {
        if(err){
            next(err);
        }
        res.send({"exists" : exists});
    });
};
