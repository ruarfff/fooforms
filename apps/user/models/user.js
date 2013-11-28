/*jslint node: true */
'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google', 'yahoo', 'linkedin'];

var UserSchema = new Schema({
    name: String,
    username: {
        type: String,
        requires: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    },
    photo: String,
    provider: String,
    salt: String,
    facebook: {},
    twitter: {},
    github: {},
    google: {},
    yahoo: {},
    linkedin: {}

});


UserSchema.path('email').validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) {
        return true;
    }
    return email.length;
}, 'Email cannot be blank');

UserSchema.path('username').validate(function(username) {
    if (authTypes.indexOf(this.provider) !== -1) {
        return true;
    }
    return username.length;
}, 'Username cannot be blank');

UserSchema.path('password').validate(function(password) {
    if (authTypes.indexOf(this.provider) !== -1) {
        return true;
    }
    return password.length;
}, 'Password cannot be blank');

/**
 * Checks if a value is null or empty
 * @param value
 * @returns If the value is null or has no length(empty)
 */
var notNullOrEmpty = function(value) {
    return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
    if (!this.isNew) {
        return next();
    }
    this._password = this.password;
    this.salt = this.makeSalt();
    this.password = this.encryptPassword(this.password);

    // If no password is present and we are not using a provider, return an error in the callback
    if (!notNullOrEmpty(this.password) && authTypes.indexOf(this.provider) === -1) {
        next(new Error('Invalid password'));
    }
    else {
        next();
    }
});

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
        if (!password) {
            return '';
        }
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    }
};

var userModel = mongoose.model('User', UserSchema);
exports.userModel = userModel;