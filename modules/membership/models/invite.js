'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var inviteSchema = new Schema({
    organisation: {
        type: Schema.Types.ObjectId,
        ref: 'Organisation',
        required: true
    },
    inviter: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    email: String,
    message: String,
    status: String,
    created: Date,
    lastModified: Date,
    // An expiration date can be set on an invite after which it can no longer be used
    expires: Date,
    // Open invites can be disabled using this value
    active: {
        type: Boolean,
        default: false
    },
    // Keep track of how many people were signed using this invite
    timesUsed: {
        type: Number,
        default: 0
    },
    // Optionally set a maximum number of times this invite can be used
    maxTimesUsed: {
        type: Number,
        default: 0
    }
});

inviteSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.lastModified = new Date();
        return next();
    }
    this.created = new Date();
    this.lastModified = new Date();
    return next();
});


exports.Invite = mongoose.model('Invite', inviteSchema);
