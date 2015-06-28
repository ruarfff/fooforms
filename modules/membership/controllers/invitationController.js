var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var log = require('fooforms-logging').LOG;
var statusCodes = require('fooforms-rest').statusCodes;
var slug = require('slug');
var membership = new Membership(db);
var email = require('../lib/emails');


exports.findById = function (req, res, next) {
    membership.findInviteById(req.params.invite, function (err, invite) {
        if (err) next(err);
        if (invite) {
            res.send(invite);
        } else {
            res.status(statusCodes.NOT_FOUND).json('Invite not found');
        }
    });
};

exports.create = function (req, res, next) {

    /**
    var invite = new Invite({
        status: 'started',
        organisation: req.body.organisation,
        inviter: req.user,
        email: req.body.email,
        message: req.body.message
    });
    invite.save(function (err, savedInvite) {
        if (err) return next(err);
        if (savedInvite) {
            Invite.populate(savedInvite, {path: 'organisation', model: 'Organisation'}, function (err, savedInvite) {
                if (err) return next(err);
                if (!savedInvite) return res.status(statusCodes.BAD_REQUEST).send();
                // Passing in json like this to avoid another populate call for user
                email.sendInvitation({
                    _id: savedInvite._id,
                    status: savedInvite.status,
                    organisation: savedInvite.organisation,
                    inviter: req.user,
                    email: savedInvite.email,
                    message: savedInvite.message
                }, function (err, updatedInvite) {
                    if (err) return next(err);
                    savedInvite.status = updatedInvite.status;
                    savedInvite.save(function (err, createdInvite) {
                        if (err) return next(err);
                        res.location('/invite/' + createdInvite._id);
                        res.status((createdInvite.status === 'sent') ? statusCodes.CREATED : statusCodes.GONE).send(createdInvite);
                    });

                });
            });
        } else {
            return next(new Error('Could not create invitation'));
        }
    });
     */
};



