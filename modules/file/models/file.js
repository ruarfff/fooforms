/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fileSchema = new Schema({
    bucket: String,
    fileId: String,
    contentType: String,
    etag: String,
    kind: String,
    md5Hash: String,
    mediaLink: String,
    selfLink: String,
    name: String,
    originalName: String,
    icon: String,
    mimeType: String,
    size: Number,
    permissions: {},
    updated: String,
    created: Date,
    lastModified: Date
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

