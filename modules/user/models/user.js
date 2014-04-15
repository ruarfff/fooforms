/*jslint node: true */
'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var crypto = require('crypto');
var uniqueValidator = require('mongoose-unique-validator');
var authTypes = ['github', 'twitter', 'facebook', 'google', 'yahoo', 'linkedin'];

var userSchema = new Schema({
    // Users full name
    name: {
        familyName: String,
        givenName: String,
        middleName: String
    },
    // Users unique display/user name 
    displayName: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    // Admin users see more of the site
    admin: {
        type: Boolean,
        default: false
    },
    photo: {
        type: String,
        default: ''
    },
    provider: String,
    salt: String,
    // The user folder
    folder: {
        type: Schema.Types.ObjectId,
        ref: 'Folder'
    },
    // List of folders that this User is a member of
    folderMemberships: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Folder'
        }
    ],
    created: Date,
    lastModified: Date,
    facebook: {},
    twitter: {},
    github: {},
    google: {},
    yahoo: {},
    linkedin: {}
});

userSchema.plugin(uniqueValidator);

userSchema.path('email').validate(function (email) {
    if (authTypes.indexOf(this.provider) !== -1) {
        return true;
    }
    return email.length;
}, 'Email cannot be blank');

userSchema.path('displayName').validate(function (displayName) {
    if (authTypes.indexOf(this.provider) !== -1) {
        return true;
    }
    return displayName.length;
}, 'Username cannot be blank');

userSchema.path('password').validate(function (password) {
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
var notNullOrEmpty = function (value) {
    return value && value.length;
};

/**
 * Pre-save hook
 */
userSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.lastModified = new Date();
        return next();
    }
    this.created = new Date();
    this.lastModified = new Date();
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
userSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function (password) {
        if (!password) {
            return '';
        }
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    },

    addFolderMembership: function (folderId, next) {
        if (!this.folderMemberships) {
            this.folderMemberships = [];
        }
        if (this.folderMemberships.indexOf(folderId) > -1) {
            var error = new Error('User is already a member of this Folder');
            error.http_code = 403;
            return next(error, this);
        } else {
            this.folderMemberships.push(folderId);
            this.save(next);
        }
    },

    removeFolderMembership: function (folderId, next) {
        var index = -1;
        if (this.folderMemberships) {
            index = this.folderMemberships.indexOf(folderId);
        }
        if (index > -1) {
            this.folderMemberships.splice(index, 1);
            this.save(next);
        } else {
            var error = new Error('User is not a member of this Folder');
            error.http_code = 403;
            return next(error, this);
        }
    }
};

/**
 * Statics
 */

userSchema.statics.findByDisplayName = function (displayName, next) {
    this.findOne({ displayName: displayName }, next);
};

userSchema.statics.findUserByEmail = function (email, next) {
    this.findOne({ email: email }, next);
};

exports.User = mongoose.model('User', userSchema);
