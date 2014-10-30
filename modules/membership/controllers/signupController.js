var slug = require('slug');
var path = require('path');
var rootPath = path.normalize(__dirname + '/../../..');
var rootUrls = require(path.join(rootPath, 'config/rootUrls'));
var viewDir = path.join(__dirname, '../views');
var signupPath = path.join(viewDir, 'signup');
var loginPath = path.join(viewDir, 'login');
var log = require('fooforms-logging').LOG;
var Membership = require('fooforms-membership');
var FooForm = require('fooforms-forms');
var db = require('mongoose').connection;
var membership = new Membership(db);
var fooForm = new FooForm(db);
var defaultFolders = require('../lib/defaultFolders');


exports.signup = function (req, res, next) {
    "use strict";
    var formDetails = req.body;

    var displayName = formDetails.displayName || '';
    var organisationName = formDetails.organisationName || '';

    var userDetail = {
        isInvite: formDetails.isInvite || false,
        email: formDetails.email,
        organisationName: slug(organisationName),
        organisation: formDetails.organisation,
        displayName: slug(displayName),
        password: formDetails.password,
        confirmPass: formDetails.confirmPass
    };

    membership.register(userDetail, function (err, result) {
        if (err || !result || !result.success) {
            if (!result) {
                result = {};
                result.err = err || new Error('An unknown error occurred.');
            }
            res.status(400).send(result);
        } else {

            var args = {
                user: result.user,
                organisation: result.organisation,
                membership: membership,
                Folder: fooForm.Folder
            };

            if(userDetail.isInvite) {
                defaultFolders.createDefaultUserFolder(args, function(err, result) {
                    if (err || !result.success) {
                        log.error(err);
                        log.info(result);
                    }
                    res.status(200).end();
                });
            } else {
                defaultFolders.createDefaultFolders(args, function (err, result) {
                    if (err || !result.success) {
                        log.error(err);
                        log.info(result);
                    }
                    // TODO: At this point the user exist but something may have gone wrong creating default folders and
                    // this is not being handled. Need ot update to fix that but it's a bit of work.
                    res.status(200).end();
                });
            }
        }
    });
};

// TODO: This is used for organisations too, bit confusing.
exports.checkUserName = function (req, res, next) {
    var username = req.params.username;
    var sluggedUsername;
    if (username) {
        sluggedUsername = slug(username);
        try {
            for (var property in rootUrls) {
                if (rootUrls.hasOwnProperty(property)) {
                    if (sluggedUsername === property) {
                        return res.send({"exists": true});
                    }
                }
            }
        } catch (err) {
            log.error(err);
        }
        membership.checkDisplayNameExists(sluggedUsername, function (err, exists) {
            if (err) {
                log.error(err);
                return next(err);
            }
            if (sluggedUsername && (sluggedUsername !== username) && !exists) {
                return res.send({"slugged": true, "sluggedValue": sluggedUsername})
            } else {
                return res.send({"exists": exists});
            }
        });
    } else {
        if (sluggedUsername && (sluggedUsername !== username)) {
            return res.send({"slugged": true, "sluggedValue": sluggedUsername})
        } else {
            return res.send({"exists": false});
        }
    }
};

