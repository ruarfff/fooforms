var configuration = require('../../../config/config');

exports.signup = function (req, res, next) {
    var body = req.body;
    if (body.password1 !== body.password2) {
        return next(new Error("Passwords must match"));
    } else {
        pass.createUser(
            body.displayName,
            body.email,
            body.password,
            body.password2,
            false,
            function (err, user) {
                if (err) {
                    return res.render('signup', {user: req.user, message: err.code === 11000 ? "User already exists" : err.message});
                }
                req.login(user, function (err) {
                    if (err) {
                        return next(err);
                    }
                    // successful login
                    res.redirect('/');
                });
            });
        return next();
    }

};