/*jslint node: true */
'use strict';

var cloudLib = require( global.config.apps.CLOUD );
var Cloud = require( '../models/cloud' ).Cloud;
var log = require( global.config.apps.LOGGING ).LOG;

exports.update = function ( req, res ) {
    try {
        var updatedCloud = req.body;
        var id = updatedCloud._id;
        Cloud.findOneAndUpdate({ _id: id }, updatedCloud, {upsert: true, "new": false}).exec(function (err, cloud) {
            if (err) {
                log.error(err.toString());
                res.status(400);
                res.send(err);
            } else {
                res.status(200);
                res.send(cloud);
            }
        });

    } catch (err) {
        log.error(err.toString());
        res.status(500);
        res.send(err);
    }
};

exports.delete = function (req, res) {
    try {
        var id = req.body._id;
        Cloud.findOneAndRemove({ _id: id }).remove(function (err, cloud) {
            if (err) {
                log.error(err.toString());
                res.status(400);
                res.send(err);
            } else {
                res.send(200);
            }
        });

    } catch (err) {
        log.error(err.toString());
        res.status(500);
        res.send(err);
    }
};
