/*jslint node: true*/
"use strict";

var authentication = require('../../authentication/lib');
var User = require('../models/user').User;


exports.createUserLocalStrategy = function (userJSON, next) {
    var user = new User(userJSON);
    user.provider = 'local';
    user.save(next(err, user));
};