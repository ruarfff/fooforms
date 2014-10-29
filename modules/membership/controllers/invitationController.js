var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var log = require('fooforms-logging').LOG;
var stringUtil = require('fooforms-rest').stringUtil;
var statusCodes = require('fooforms-rest').statusCodes;
var slug = require('slug');
var membership = new Membership(db);
var Invite = require('../models/invite');


exports.findById = function (req, res, next) {

};

exports.create = function (req, res, next) {
    var invite = new Invite();
    invite.save(function (err, savedInvite) {
        res.send(savedInvite._id);
    });
};



