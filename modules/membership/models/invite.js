/*jslint node: true */
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
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: String,
    status: String,
    timeToLive: {
        type: Number,
        default: -1
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

