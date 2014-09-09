/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Post = require('./post');

var commentSchema = Schema({
    content: String,
    created: Date,
    lastModified: Date,
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    commenter: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

commentSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.lastModified = new Date();
        return next();
    }
    this.created = new Date();
    this.lastModified = new Date();
    next();
});


exports.Comment = mongoose.model('Comment', commentSchema);

