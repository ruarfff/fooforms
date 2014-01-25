/*jslint node: true */
'use strict';

var Cloud = require('../models/cloud').Cloud;

exports.getCloudById = function (id) {
    Cloud.findById(id, function (err, cloud) {

    });
};


exports.getUserClouds = function (userId, next) {
    Cloud.find({ owner: userId }, function (err, cloud) {

    });
};