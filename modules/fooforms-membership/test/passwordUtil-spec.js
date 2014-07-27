/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
"use strict";

var auth = require('../lib/passwordUtil');


var should = require('should');
var assert = require('assert');


describe('Password Util', function () {
    var salt = 'somesalt';
    var password = 'password';

    describe('encrypting a password', function () {
        it('encrypted password is not the same as original password', function () {
           auth.encryptPassword(password, salt).should.not.equal(password);
        });
    });

    describe('encrypting a password with invalid inputs', function () {
        it('when password is null, null is returned', function () {
           should.not.exist(auth.encryptPassword(null, salt));
        });

        it('when salt is null, null is returned', function () {
            should.not.exist(auth.encryptPassword(password, null));
        });

        it('when both password and salt are null, null is returned', function () {
            should.not.exist(auth.encryptPassword(null, null));
        });
    });

    describe('checking a valid password', function () {
        var encryptedPass = auth.encryptPassword(password, salt);
        (auth.checkPassword(password, encryptedPass, salt)).should.equal(true);
    });

    describe('checking an invalid password', function () {
        var encryptedPass = auth.encryptPassword(password, salt);
        var invalidPass = 'invalidPass';
        (auth.checkPassword(invalidPass, encryptedPass, salt)).should.equal(false);
    });


    describe('making a salt', function () {
        var realSalt = auth.makeSalt();

        it('is defined', function () {
           should.exist(realSalt);
        });
        it('is a string', function () {
            realSalt.should.be.type('string');
        });
    });
});