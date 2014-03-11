/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    name: String,
    description: String,
    icon: String,
    menuLabel: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    fields: {}
});

exports.Post = mongoose.model('Post', postSchema);

