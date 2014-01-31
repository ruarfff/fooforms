/*jslint node: true */
'use strict';

var Cloud = require('../models/cloud').Cloud;
var cloudCreator = require('./cloudCreator');


module.exports = {
    Cloud: Cloud,
    createCloud: cloudCreator.createCloud
};
