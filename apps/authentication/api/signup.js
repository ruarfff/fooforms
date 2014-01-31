var configuration = require('../../../config/config');
var userLib = require(global.config.apps.USER);

exports.signup = function (req, res, next) {
    var body = req.body;
    var displayName = body.displayName;
    var email = body.email;
    var password = body.password;
    var verification = body.verification;

    var error = null;
    // regexp from https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js#L4
    var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

    // check for valid inputs
    if (!displayName || !email || !password || !verification) {
        error = 'All fields are required';
    } else if (displayName !== encodeURIComponent(displayName)) {
        error = 'Username may not contain any non-url-safe characters';
    } else if (!email.match(EMAIL_REGEXP)) {
        error = 'Email is invalid';
    } else if (password !== verification) {
        error = 'Passwords don\'t match';
    }

    if (error) {
        res.status(403);
        res.render('signup', {
            error: error
        });
        return
    }

    // check if username is already taken
    userLib.checkDisplayName(displayName).onResolve(function (err, user) {
        "use strict";
        if (user) {
            res.status(403);
            res.render('signup', {
                error: 'Username is already taken'
            });
            return;
        }
        if (err) {
            res.status(500);
            log.error(err.toString());
            return res.render('signup', { error: err.message });
        }


    });


    pass.createUser(
        body.displayName,
        body.email,
        body.password,
        body.verification,
        false,
        function (err, user) {
            if (err) {
                res.status(403);
                return res.render('signup', { error: err.code === 11000 ? "User already exists" : err.message });
            }
            req.login(user, function (err) {
                if (err) {
                    return next(err);
                }
                response.json(200, user);
            });
        });
    return next();


};


exports.checkUserName = function (req, res, next) {
    "use strict";
    var username = req.body.username;
    // check if username contains non-url-safe characters
    if (username !== encodeURIComponent(username)) {
        res.json(403, {
            invalidChars: true
        });
        return;
    }
    // check if username is already taken - query your db here
    var usernameTaken = false;
    for (var i = 0; i < dummyDb.length; i++) {
        if (dummyDb[i].username === username) {
            usernameTaken = true;
            break;
        }
    }
    if (usernameTaken) {
        res.json(403, {
            isTaken: true
        });
        return
    }
    // looks like everything is fine
    res.send(200);
};

