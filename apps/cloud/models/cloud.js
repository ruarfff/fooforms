/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var log = require(global.config.apps.LOGGING).LOG;


var CloudSchema = new Schema({
    // The name of the cloud. Used in URL
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    // The reference to the owner of the cloud
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Visual aid
    menuLabel: String,
    // If Private, cloud only accessible by members. Visible to all otherwise
    isPrivate: {
        type: Boolean,
        default: false
    },
    // User clouds don't allow adding
    isUserCloud: {
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
    // List of Apps stored in Cloud
    apps: [
        {
            type: Schema.Types.ObjectId,
            ref: 'App'
        }
    ],
    // A human readable description of the Cloud
    description: String,
    // URL to Icon to display in UI
    icon: String
});

// Mongoose doesn't enforce uniqueness by default. Using plugin.
CloudSchema.plugin(uniqueValidator);

// Schema Statics

/**
 * Find a Cloud by name
 *
 * @param name - The name to search for
 * @param next - Call back, gets passed err and cloud
 */
CloudSchema.statics.findByName = function (name, next) {
    this.findOne({ name: new RegExp(name, 'i') }, next);
};

/**
 *
 * @param ownerId
 * @param next
 */
CloudSchema.statics.findByOwner = function (ownerId, next) {
    this.find({owner: ownerId}, next);
};

// Create the model
var Cloud = mongoose.model('Cloud', CloudSchema);

// User Clouds are a special case so ensure members cannot be added
Cloud.schema.path('members').validate(function (members) {
    return !(this.isUserCloud && (members && members.length > 0));
}, 'User cloud cannot have members');

Cloud.schema.path('membersWithWritePermissions').validate(function (membersWithWritePermissions) {
    return !(this.isUserCloud && (membersWithWritePermissions && membersWithWritePermissions.length > 0));
}, 'User cloud cannot have members');

module.exports = {
    Cloud: Cloud
};