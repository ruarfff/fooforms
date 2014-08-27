/*jslint node: true */

var File = require('../models/file').File;
var log = require(global.config.modules.LOGGING).LOG;

exports.makeFileName = function () {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();

};
