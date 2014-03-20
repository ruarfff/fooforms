/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = Schema({
    name: String,
    description: String,
    icon: String,
    menuLabel: String,
    app: { type: Schema.Types.ObjectId, ref: 'App' },
    fields: {}
});


exports.Post = mongoose.model('Post', postSchema);

