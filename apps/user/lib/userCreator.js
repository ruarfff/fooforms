/*jslint node: true*/
var User = require('../models/user').User;


exports.createUserLocalStrategy = function (userJSON, next) {
    "use strict";
    var user = new User(userJSON);
    user.provider = 'local';
    user.save(next(err, user));
};