/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

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
    // If Private, cloud only accessable by memebers. Visible to all otherwise  
    private: {
        type: Boolean,
        default: false
    },
    // List fo memebers with read permissions
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

var Cloud = mongoose.model('Cloud', CloudSchema);

module.exports = {
    Cloud: Cloud
};
