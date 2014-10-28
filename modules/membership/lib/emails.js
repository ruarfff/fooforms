/*jslint node: true*/

var log = require('fooforms-logging').LOG;
var emailer = require('../../email');


exports.send = function (next) {
    emailer.sendHelloWorld(next);
};