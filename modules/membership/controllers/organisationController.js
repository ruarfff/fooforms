var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var log = require('fooforms-logging').LOG;
var stringUtil = require('fooforms-rest').stringUtil;
var statusCodes = require('fooforms-rest').statusCodes;
var membership = new Membership(db);


exports.findById = function (req, res, next) {
    membership.findOrganisationById(req.params.organisation, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            res.send(result.data);
        } else {
            res.status(statusCodes.NOT_FOUND).json('Organisation not found');
        }
    });
};

exports.listByDisplayName = function (req, res, next) {
    var displayName = req.query.name || '';
    membership.searchOrganisations({displayName: new RegExp('^' + stringUtil.escapeRegExpChars(displayName), 'i')}, function (err, result) {
        if (err) {
            next(err);
        }

        res.status(statusCodes.OK).json(result.data);

    });
};

exports.create = function (req, res, next) {
    membership.createOrganisation(req.body, function (err, result) {
        if (err) {
            return next(err);
        }
        if (result.success) {
            res.location('/organisations/' + result.organisation._id);
            res.status(statusCodes.CREATED).json(result);
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result);
        }
    });
};

exports.update = function (req, res, next) {
    membership.updateOrganisation(req.body, function (err, result) {
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
    membership.deleteOrganisation({_id: req.params.organisation}, function (err, result) {
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
