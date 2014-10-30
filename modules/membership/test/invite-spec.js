/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId();
var mockgoose = require('mockgoose');
mockgoose(mongoose);
var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var membership = new Membership(db);

var request = require('supertest');
var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var should = require('should');
var rootUrls = require('../../../config/rootUrls');
var inviteRoutes = require('../routes/inviteApiRoutes');



var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var engine = require('ejs');
app.engine('.html', engine.__express);
app.set('view engine', 'html');

var inviteRootUrl = '/' + rootUrls.invite;

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    req.isAuthenticated = function() {
        return true;
    };
    req.user = {};
    next();
});

app.use(inviteRootUrl, inviteRoutes);

describe('Invite Routes', function () {

    var displayName = 'name';
    var email = 'user@test.com';
    var otherDisplayName = 'naother';
    var otherEmail = 'otherUser@test.com';
    var password = 'pass';
    var confirmPass = 'pass';
    var organisationName = 'fooforms';
    var otherOrganisationName = 'otherFooforms';

    var user = {};
    var otherUser = {};

    beforeEach(function (done) {
        mockgoose.reset();
    });

});
