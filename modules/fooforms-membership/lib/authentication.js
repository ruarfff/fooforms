"use strict";
var Emitter = require('events').EventEmitter;
var util = require('util');
var assert = require('assert');

var User = require('../models/user');
var passwordUtil = require('./passwordUtil');

var AuthResult = function(credentials) {
    return {
        credentials: credentials,
        success: false,
        message: 'Invalid login',
        user: null
    };
};

var Authentication = function () {
    Emitter.call(this);
    var self = this;
    var continueWith = null;

    var eventType = {
        loginReceived: 'login-received',
        credsOK: 'creds-ok',
        invalid: 'invalid',
        userFound: 'userFound',
        passwordAccepted: 'password-accepted',
        statsUpdated: 'stats-updated',
        authenticated: 'authenticated',
        notAuthenticated: 'not-authenticated'
    };

    var validateCredentials = function (authResult) {
        if(authResult.credentials.username && authResult.credentials.password) {
            self.emit(eventType.credsOK, authResult);
        } else {
            self.emit(eventType.invalid, authResult);
        }
    };

    var findUser = function (authResult) {
        User.findOne({'$or': [{email: authResult.credentials.username}, {displayName: authResult.credentials.username}]}, function(err, user){
            assert.ok(err === null, err);
            if(user) {
                authResult.user = user;
                self.emit(eventType.userFound, authResult);
            } else {
                self.emit(eventType.invalid, authResult);
            }
        });
    };

    var comparePasswords = function (authResult) {
        var matched = passwordUtil.checkPassword(authResult.credentials.password, authResult.user.password, authResult.user.salt);
        if(matched) {
            self.emit(eventType.passwordAccepted, authResult);
        } else {
            self.emit(eventType.invalid, authResult);
        }
    };

    var updateUserStats = function (authResult) {
        var user = authResult.user;
        user.lastLogin = new Date();
        user.signInCount += 1;
        user.save(function (err, savedUser) {
            assert.ok(err === null, err);
            authResult.user = savedUser;
            self.emit(eventType.statsUpdated, authResult);
        });

    };

    var authSuccess = function (authResult) {
        authResult.success = true;
        authResult.message = 'Logged in successfully';
        self.emit(eventType.authenticated, authResult);
        if(continueWith) {
            continueWith(null, authResult);
        }
    };

    var authFailure = function (authResult) {
        authResult.success = false;
        authResult.user = null;
        self.emit(eventType.notAuthenticated, authResult);
        if(continueWith) {
            continueWith(null, authResult);
        }
    };

    self.on(eventType.loginReceived, validateCredentials);
    self.on(eventType.credsOK, findUser);
    self.on(eventType.userFound, comparePasswords);
    self.on(eventType.passwordAccepted, updateUserStats);
    self.on(eventType.statsUpdated, authSuccess);
    self.on(eventType.invalid, authFailure);

    self.authenticate = function (credentials, next) {
        continueWith = next;
        var authResult = new AuthResult(credentials);
        self.emit(eventType.loginReceived, authResult);
    };

    self.events = eventType;
};

util.inherits(Authentication, Emitter);

module.exports = Authentication;