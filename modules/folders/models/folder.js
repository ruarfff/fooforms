/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var log = require(global.config.modules.LOGGING).LOG;


var FolderSchema = new Schema({
    // The name of the folder. Used in URL
    name: {
        type: String,
        required: true,
        index: true
    },
    // The reference to the owner of the folder
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Visual aid
    menuLabel: String,
    // A human readable description of the folder
    description: String,
    // URL to Icon to display in UI
    icon: String,
    // If Private, folder only accessible by members. Visible to all otherwise
    isPrivate: {
        type: Boolean,
        default: false
    },
    // User folders don't allow adding
    isUserFolder: {
        type: Boolean,
        default: false
    },
    // List fo members with read permissions
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    // List of members with write permissions
    membersWithWritePermissions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    // List of Forms stored in folder
    forms: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Form'
        }
    ],
    created: Date,
    lastModified: Date
});

// Mongoose doesn't enforce uniqueness by default. Using plugin.
FolderSchema.plugin(uniqueValidator);

// Schema Statics

/**
 * Find a folder by name
 *
 * @param name - The name to search for
 * @param next - Call back, gets passed err and folder
 */
FolderSchema.statics.findByName = function (name, next) {
    this.findOne({ name: new RegExp(name, 'i') }, next);
};

/**
 *
 * @param ownerId
 * @param next
 */
FolderSchema.statics.findByOwner = function (ownerId, next) {
    this.find({owner: ownerId}, next);
};

FolderSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.lastModified = new Date();
        return next();
    }
    this.created = new Date();
    this.lastModified = new Date();
    return next();
});

// Create the model
var Folder = mongoose.model('Folder', FolderSchema);

// User Folders are a special case so ensure members cannot be added
Folder.schema.path('members').validate(function (members) {
    return !(this.isUserFolder && (members && members.length > 0));
}, 'User Folder cannot have members');

Folder.schema.path('membersWithWritePermissions').validate(function (membersWithWritePermissions) {
    return !(this.isUserFolder && (membersWithWritePermissions && membersWithWritePermissions.length > 0));
}, 'User Folder cannot have members');

Folder.schema.path('name').validate(function (name) {
    return true;
}, 'User Folder cannot have more than one folder with this name');

module.exports = {
    Folder: Folder
};