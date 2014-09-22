var FooForm = require('fooforms-forms');
var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var statusCodes = require('fooforms-rest').statusCodes;
var fooForm = new FooForm(db);
var membership = new Membership(db);

exports.getUserDashboard = function (req, res, next) {
  // TODO: Populate a full view of users dashboard
};
