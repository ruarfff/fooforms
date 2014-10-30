var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var log = require('fooforms-logging').LOG;
var statusCodes = require('fooforms-rest').statusCodes;
var slug = require('slug');
var membership = new Membership(db);
var Invite = require('../models/invite').Invite;
var email = require('../lib/emails');


exports.findById = function (req, res, next) {
    Invite.findById(req.params.invite).populate('organisation').exec(function (err, invite) {
        if (err) next(err);
        if (invite) {
            res.send(invite);
        } else {
            res.status(statusCodes.NOT_FOUND).json('Invite not found');
        }
    });
};

exports.create = function (req, res, next) {
    var invite = new Invite({
        status: 'started',
        organisation: req.body.organisation,
        inviter: req.user,
        email: req.body.email
    });
    invite.save(function (err, savedInvite) {
        if (err) next(err);
        Invite.populate(savedInvite, {path: 'organisation', model: 'Organisation'}, function (err, savedInvite) {
            if (!savedInvite) res.status(statusCodes.BAD_REQUEST).send();
            // Passing in json like this to avoid another populate call for user
            email.sendInvitation({
                _id: savedInvite._id,
                status: savedInvite.status,
                organisation: savedInvite.organisation,
                inviter: req.user,
                email: savedInvite.email
            }, function (err, updatedInvite) {
                if (err) next(err);
                savedInvite.status = updatedInvite.status;
                savedInvite.save(function (err, createdInvite) {
                    if (err) next(err);
                    res.location('/invite/' + createdInvite._id);
                    res.status((createdInvite.status === 'sent') ? statusCodes.CREATED : statusCodes.GONE).send(createdInvite);
                });
            });
        });
    });
};



