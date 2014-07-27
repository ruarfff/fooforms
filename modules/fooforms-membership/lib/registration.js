"use strict";
var Emitter = require('events').EventEmitter;
var util = require('util');
var assert = require('assert');

var User = require('../models/user');
var Application = require('../models/application');
var passwordUtil = require('./passwordUtil');


var RegisterResult = function() {
    return {
        success: false,
        message: null,
        user: null
    };
};

var Registration = function () {
    Emitter.call(this);
    var self = this;

    var eventType = {
        invalid: 'invalid',
        validated: 'validated',
        userDoesNotExist: 'user-does-not-exist',
        userCreated: 'user-created',
        applicationReceived: 'application-received',
        registered: 'registered',
        notRegistered: 'not-registered'

    };

    var continueWith = null; // For using the callback with event emitter

    var validateInputs = function (app) {
        if(!app.displayName || !app.email || !app.password){
            app.setInvalid('Email, username and password are required');
            self.emit(eventType.invalid, app);
        } else if (app.password !== app.confirmPass) {
            app.setInvalid('Password do not match');
            self.emit(eventType.invalid, app);
        } else {
            app.validate();
            self.emit(eventType.validated, app);
        }
    };

    var checkIfUserExists = function (app) {
        User.findOne({'$or': [{email: app.email}, {displayName: app.displayName}]}, function(err, user){
            assert.ok(err === null, err);
            if(user) {
                app.setInvalid('User already exists');
                self.emit(eventType.invalid, app);
            } else {
                self.emit(eventType.userDoesNotExist, app);
            }
        });
    };

    var createUser = function (app) {
        var user = new User(app);
        user.signInCount = 1;
        user.lastLogin = new Date();
        user.salt = passwordUtil.makeSalt();
        user.password = passwordUtil.encryptPassword(user.password, user.salt);
        user.save(function (err, savedUser) {
            assert.ok(err === null, err);
            app.user = savedUser;
            if(!app.user) {
                app.setInvalid('Could not create user');
                self.emit(eventType.invalid, app);
            } else {
                self.emit(eventType.userCreated, app);
            }
        });
    };

    var registrationSuccess = function (app) {
        var regResult = new RegisterResult();
        regResult.success = true;
        regResult.message = 'Successfully registered';
        regResult.user = app.user;
        self.emit(eventType.registered, app);
        if(continueWith) {
            continueWith(null, regResult);
        }
    };

    var registrationFailed = function (app) {
        var regResult = new RegisterResult();
        regResult.success = false;
        regResult.message = app.message;
        self.emit(eventType.notRegistered, app);
        if(continueWith) {
            continueWith(null, regResult);
        }
    };

    self.on(eventType.applicationReceived, validateInputs);
    self.on(eventType.validated, checkIfUserExists);
    self.on(eventType.userDoesNotExist, createUser);
    self.on(eventType.userCreated, registrationSuccess);
    self.on(eventType.invalid, registrationFailed);

    self.register = function (args, next) {
        continueWith = next;
        var app = new Application(args);
        self.emit(eventType.applicationReceived, app);
    };

    self.events = eventType;


    return self;
};


util.inherits(Registration, Emitter);

module.exports = Registration;