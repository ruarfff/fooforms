/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fileSchema = new Schema({
    name: String,
    internalName: String,
    icon: String,
    mimeType: String,
    sizeKB: Number,
    created: Date,
    lastModified: Date,
    owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

fileSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.lastModified = new Date();
        return next();
    }
    this.created = new Date();
    this.lastModified = new Date();
    return next();
});

exports.File = mongoose.model('File', fileSchema);

