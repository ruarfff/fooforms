/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = Schema({
    name: String,
    description: String,
    icon: String,
    menuLabel: String,
    created: Date,
    lastModified: Date,
    app: { type: Schema.Types.ObjectId, ref: 'App' },
    comments: [ { type: Schema.Types.ObjectId, ref: 'Comment' } ],
    fields: []
});

postSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.lastModified = new Date();
        return next();
    }
    this.created = new Date();
    this.lastModified = new Date();
    next();
});


exports.Post = mongoose.model('Post', postSchema);

