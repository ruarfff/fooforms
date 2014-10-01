var slug = require('slug');
var path = require('path');
var rootPath = path.normalize(__dirname + '/../../..');
var rootUrls = require(path.join(rootPath, 'config/rootUrls'));
var viewDir = path.join(__dirname, '../views');
var signupPath = path.join(viewDir, 'signup');
var loginPath = path.join(viewDir, 'login');
var log = require('fooforms-logging').LOG;
var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var membership = new Membership(db);

exports.signup = function (req, res, next) {
    "use strict";
    var formDetails = req.body;

    var displayName = formDetails.displayName || '';
    var organisationName = formDetails.organisationName || '';

    var userDetail = {
        name: {
            givenName: formDetails.givenName,
            familyName: formDetails.familyName
        },
        email: formDetails.email,
        organisationName: slug(organisationName),
        displayName: slug(displayName),
        password: formDetails.password,
        confirmPass: formDetails.confirmPass
    };

    membership.register(userDetail, function (err, result) {
        if (result && result.success) {
            res.render(loginPath, {
                title: 'Login',
                message: 'Successfully signed up. Please log in.'
            });
        } else {
            if (!result) {
                result = {};
                result.err = err || new Error('An unknown error occurred.');
            }
            res.render(signupPath, {
                title: 'Sign Up',
                error: result
            });
        }
    });
};

exports.checkUserName = function (req, res, next) {
    var username = req.params.username;
    if(username) {
        username = slug(username);
        try {
            for (var property in rootUrls) {
                if (rootUrls.hasOwnProperty(property)) {
                    if (username === property) {
                        return res.send({"exists": true});
                    }
                }
            }
        } catch (err) {
            log.error(err);
        }
        membership.checkDisplayNameExists(username, function (err, exists) {
            if (err) {
                next(err);
            }
            return res.send({"exists": exists});
        });
    } else {
        return res.send({"exists": false});
    }
};
