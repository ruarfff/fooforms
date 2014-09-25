var path = require('path');
var modulePath = path.normalize(__dirname + '/../..');
var viewDir = path.join(modulePath, 'membership/views');
var signupPath = path.join(viewDir, 'signup');

var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var membership = new Membership(db);

exports.signup = function (req, res, next) {
    "use strict";
    var formDetails = req.body;

    var userDetail = {
        name: {
            givenName: formDetails.givenName,
            familyName: formDetails.familyName
        },
        email: formDetails.email,
        organisationName: formDetails.organisationName,
        displayName: formDetails.displayName,
        password: formDetails.password,
        confirmPass: formDetails.verification
    };

    membership.register(userDetail, function (err, result) {
        if (result && result.success) {
            res.redirect('/login');
        } else {
            if (!result) {
                result = {};
                result.err = err;
            }
            res.render(signupPath, {
                title: 'Sign Up',
                error: result
            });
        }
    });
};
