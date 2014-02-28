/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appSchema = Schema({

    id: Number,
    name: {
        type: String,
        required: true,
        index: true
    },
    icon: String,
    description: String,
    menuLabel: {
        type: String,
        required: true,
        index: true
    },
    btnLabel: String,
    settings: {},
    fields: [],
    version: Number,
    created: Date,
    lastModified: Date,
    owner: { type: Schema.Types.ObjectId, ref: 'User' }

});

exports.App = mongoose.model('App', appSchema);

