/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var log = require(global.config.modules.LOGGING).LOG;

var formSchema = Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    icon: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    menuLabel: {
        type: String,
        required: true,
        index: true
    },
    btnLabel: {
        type: String,
        default: ''
    },
    settings: {},
    fields: [],
    version: Number,
    created: Date,
    lastModified: Date,
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    posts: [
        {type: Schema.Types.ObjectId, ref: 'Post'}
    ],
    folder: {type: Schema.Types.ObjectId, ref: 'Folder'},
    url: {
        type: String,
        default: ''
    },
    formEvents: [],
    sharing: {},
    privileges: {
        type: String,
        default: 'User'
    }
});

formSchema.pre('save', function (next) {
    this.wasNew = this.isNew;
    if (!this.isNew) {
        this.version = this.version + 1;
        this.lastModified = new Date();
        return next();
    }
    this.version = 1;
    this.created = new Date();
    this.lastModified = new Date();
    next();
});

formSchema.post('save', function () {
    try {
        if (this.wasNew) {
            //TODO: temporary solution hacked together for testing purposes (will probably end up being permanent, I just know it)
            this.url = 'forms/repo/' + this._id;
            this.save(function (err) {
                if (err) {
                    log.error(__filename, ' - ', err);
                }
            });
        }
    } catch (err) {
        log.error(__filename, ' - ', err);
    }
});

exports.Form = mongoose.model('Form', formSchema);

