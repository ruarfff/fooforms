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
    owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

exports.File = mongoose.model('File', fileSchema);

