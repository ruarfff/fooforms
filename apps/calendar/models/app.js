/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appSchema = Schema({
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
    cloud: { type: Schema.Types.ObjectId, ref: 'Cloud' }
});

exports.App = mongoose.model('App', appSchema);

