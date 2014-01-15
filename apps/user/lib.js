/*jslint node: true*/
"use strict";

var authentication = require('../authentication/lib');
var User = require('./models/user').User;


exports.userProfile = function (user) {
    var profile;
    profile = {
        id: user._id,
        name: user.name,
        displayName: user.displayName,
        photo: user.photo,
        email: user.email,
        admin: user.admin
    };
    return profile;
}

exports.createUserLocalStrategy = function (userJSON, next) {
    var user = new User(userJSON);
    user.provider = 'local';
    user.save(next(err, user));
};


exports.findUserById = function (id, next) {
    User
        .findOne({
            _id: id
        })
        .exec(next(err, user));
};

exports.findUserByEmail = function (email, next) {
    User.find({ email: email }, next)
};