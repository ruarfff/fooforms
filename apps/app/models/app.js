/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var log = require(global.config.apps.LOGGING).LOG;

var appSchema = Schema({
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
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    posts: [ {type: Schema.Types.ObjectId, ref: 'Post'} ],
    cloud: {type: Schema.Types.ObjectId, ref: 'Cloud'},
    url: String
});

appSchema.pre('save', function (next) {
    this.wasNew = this.isNew;
    next();
});

appSchema.post('save', function () {
    try {
        if (this.wasNew) {
            //TODO: temporary solution hacked together for testing purposes
            this.url = 'apps/repo/' + this._id;
            this.save(function (err) {
                if (err) {
                    log.error(err);
                }
            });
        }
    } catch (err) {
        log.error(err);
    }
});

exports.App = mongoose.model('App', appSchema);

