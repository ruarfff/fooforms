/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var openInviteSchema = new Schema({
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
    message: String,
    status: String,
    created: Date,
    lastModified: Date
});

openInviteSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.lastModified = new Date();
        return next();
    }
    this.created = new Date();
    this.lastModified = new Date();
    return next();
});


exports.OpenInvite = mongoose.model('OpenInvite', openInviteSchema);

