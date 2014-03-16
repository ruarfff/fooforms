/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    name: String,
    description: String,
    icon: String,
    menuLabel: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    fields: {}
});

exports.Post = mongoose.model('Post', postSchema);

