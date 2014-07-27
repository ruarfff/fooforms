"use strict";
var Emitter = require('events').EventEmitter;
var util = require('util');
var assert = require('assert');

var Registration = require('lib/registration');
var Authentication = require('lib/authentication');

var Membership = function () {
    Emitter.call(this);
    var self = this;
    var continueWith = null;

    var eventTypes = {
        authenticated: 'authenticated',
        notAuthenticated: 'not-authenticated',
        registered: 'registered',
        notRegistered: 'not-registered'
    };

    self.authenticate = function (username, password, next) {
        var auth = new Authentication();

        auth.on(auth.events.authenticated, function (authResult) {
            self.emit(eventTypes.authenticated, authResult);
        });
        auth.on(auth.events.notAuthenticated, function (authResult) {
            self.emit(eventTypes.notAuthenticated, authResult);
        });

        auth.authenticate({username: username, password: password}, next);
    };

    self.register = function (details, next) {
      var registration = new Registration();

        registration.on(registration.events.registered, function (regResult) {
            self.emit(eventTypes.registered, regResult);
        });

        registration.on(registration.events.notRegistered, function (regResult) {
            self.emit(eventTypes.notRegistered, regResult);
        });

        registration.register(details, next);
    };

};

util.inherits(Membership, Emitter);

module.exports = Membership;