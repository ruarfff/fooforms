/*jslint node: true */
'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var teamSchema = new Schema({
    // Team name
    name: {
        type: String,
        index: true,
        required: true
    },
    description: {
        type: String
    },
    // Members in this team
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    forms: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Form'
        }
    ],
    permissionLevel: {
        type: String,
        default: 'read'
    },
    created: Date,
    lastModified: Date
});

teamSchema.path('permissionLevel').validate(function (value) {
    return /read|write/i.test(value);
}, '{VALUE} is an invalid permission level');

/**
 * Pre-save hook
 */
teamSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.lastModified = new Date();
        return next();
    }
    this.created = new Date();
    this.lastModified = new Date();

    return next();
});

module.exports = mongoose.model('Team', teamSchema);
