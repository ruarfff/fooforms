var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var log = require('fooforms-logging').LOG;
var statusCodes = require('fooforms-rest').statusCodes;
var membership = new Membership(db);


exports.findById = function (req, res, next) {
    membership.findTeamById(req.params.team, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            res.send(result.data);
        } else {
            res.status(statusCodes.NOT_FOUND).json('Team not found');
        }
    });
};

exports.create = function (req, res, next) {
    membership.createTeam(req.body, function (err, result) {
        if (err) {
            return next(err);
        }
        if (result.success) {
            res.location('/teams/' + result.team._id);
            res.status(statusCodes.CREATED).json(result);
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result);
        }
    });
};

exports.update = function (req, res, next) {
    membership.updateTeam(req.body, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            res.send(result);
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result.message);
        }
    });
};

exports.remove = function (req, res, next) {
    membership.deleteTeam({_id: req.params.team}, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            res.status(statusCodes.NO_CONTENT).send();
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result.message);
        }
    });
};
