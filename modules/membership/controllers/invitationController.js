var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var log = require('fooforms-logging').LOG;
var stringUtil = require('fooforms-rest').stringUtil;
var statusCodes = require('fooforms-rest').statusCodes;
var slug = require('slug');
var membership = new Membership(db);


exports.findById = function (req, res, next) {

};

exports.create = function (req, res, next) {
};



