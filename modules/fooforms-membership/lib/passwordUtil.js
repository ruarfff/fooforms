"use strict";

var crypto = require('crypto');

/**
 * Encrypts a plaintext password
 *
 * @param password
 * @param salt
 * @returns {*}
 */
var encryptPassword = function (password, salt) {
    if(password && salt){
        return crypto.createHmac('sha1', salt).update(password).digest('hex');
    } else {
        return null;
    }
};

/**
 * Encrypts a plaintext password for checking against an encrypted password.
 *
 * @param plainText
 * @param encryptedPassword
 * @param salt
 * @returns {boolean}
 */
var checkPassword = function (plainText, encryptedPassword, salt) {
    return encryptPassword(plainText, salt) === encryptedPassword;
};

/**
 * Generate a salt for encryption
 *
 * @returns {string}
 */
var makeSalt = function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
};

exports.encryptPassword = encryptPassword;

exports.checkPassword = checkPassword;

exports.makeSalt = makeSalt;


