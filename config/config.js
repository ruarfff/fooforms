/*jslint node: true */
'use strict';

var _ = require('underscore');

// Load app configuration

module.exports = function(environment) {
    var currentConfig = environment || process.env.NODE_ENV;
    return _.extend(
        require(__dirname + '/env/all.js'),
            require(__dirname + '/env/' + currentConfig + '.json') || {});
};


