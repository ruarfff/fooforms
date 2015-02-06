var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var log = require('fooforms-logging').LOG;
var statusCodes = require('fooforms-rest').statusCodes;
var membership = new Membership(db);


exports.getStore = function (req, res, next) {
    membership.findOrganisationByDisplayName('formstore', function (err, result) {
        if (err) return next(err);
        if (result.success && result.data) {
            var store = result.data;

            membership.Organisation.populate(store, {path: 'teams', model: 'Team'}, function (err, store) {
                membership.Organisation.populate(store, {
                    path: 'teams.folders',
                    model: 'Folder'
                }, function (err, store) {
                    membership.Organisation.populate(store, {
                        path: 'teams.folders.forms',
                        model: 'Form'
                    }, function (err, store) {
                        for (var i = 0; i < store.teams.length; i++) {
                            for (var j = 0; j < store.teams[i].folders[0].forms.length; j++) {
                                store.teams[i].folders[0].forms[j] = store.teams[i].folders[0].forms[j].toObject();
                                delete store.teams[i].folders[0].forms[j]._id;
                                delete store.teams[i].folders[0].forms[j].folder;
                                delete store.teams[i].folders[0].forms[j].url;
                                delete store.teams[i].folders[0].forms[j].postStreams;
                            }
                        }
                        res.send(store);
                    });
                });
            });

        } else {
            res.status(statusCodes.NOT_FOUND).json('Form Store not found');
        }
    })
};