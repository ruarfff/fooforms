var Membership = require('fooforms-membership');
var FooForm = require('fooforms-forms');
var db = require('mongoose').connection;
var log = require('fooforms-logging').LOG;
var stringUtil = require('fooforms-rest').stringUtil;
var statusCodes = require('fooforms-rest').statusCodes;
var slug = require('slug');
var membership = new Membership(db);
var fooForm = new FooForm(db);
var defaultFolders = require('../lib/defaultFolders');


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
    if (req.body.displayName) {
        req.body.displayName = slug(req.body.displayName);
    }
    membership.createOrganisation(req.body, function (err, result) {
        if (err) {
            return next(err);
        }
        if (result.success) {
            var args = {
                organisation: result.organisation,
                membership: membership,
                Folder: fooForm.Folder
            };
            defaultFolders.createDefaultOrganisationFolder(args, function (err, result) {
                res.location('/organisations/' + result.organisation._id);
                res.status(statusCodes.CREATED).json(result.organisation);
            });
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result);
        }
    });
};

exports.update = function (req, res, next) {
    if (req.body.displayName) {
        req.body.displayName = slug(req.body.displayName);
    }
    membership.updateOrganisation(req.body, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            res.send(result.organisation);
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result.message);
        }
    });
};

exports.remove = function (req, res, next) {
    membership.deleteOrganisation({_id: req.body._id}, function (err, result) {
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


