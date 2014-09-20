var FooForm = require('fooforms-forms');
var db = require('mongoose').connection;
var stringUtil = require('fooforms-rest').stringUtil;
var statusCodes = require('fooforms-rest').statusCodes;

exports.createForm = function (req, res, next) {
  var fooForm = new FooForm(db);
    fooForm.createForm(req.body, function (err, result) {
        if (err) {
            return next(err);
        }
        if(result.success) {
            res.send(result);
        } else {
            res.status(400).send(result);
        }
    });
};

exports.findFormById = function (req, res, next) {
    var fooForm = new FooForm(db);
    fooForm.findFormById(req.params.form, function (err, result) {
        if(err){next(err);}
        if (result.success) {
            res.send(result.data);
        } else {
            res.status(statusCodes.NOT_FOUND).json('Form not found');
        }
    });
};
