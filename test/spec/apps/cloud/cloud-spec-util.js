/*jslint node: true */
'use strict';

/**
 *
 *    This file contians a bunch of sample data purely to help with Cloud databse tests.
 *    A lot of it may be fairly confusing but right now, can't think of a better way to do this.
 *
 *    The JSON data is some placeholder values to help with inserting objects in to the database.
 *    This can be used externally but the main use of this module is in the seedCloudsInDatabase method.
 *
 *    Calling seedCloudsInDatabase will insert 4 Users, 4 Apps and 4 Clouds ot the Database.
 *    These are populated with the JSON data contianed in this file.
 *    User1 is the owner of App1 and Cloud 1, User2 is the onwner of App2 and Cloud2 and so on...
 *    This should be enough sample data to help testign most scenarios.
 *    Setting up member and permissions as well as adding Apps to Clouds should be done in
 *    individual tests.
 *    Use spec-util.js methods to connect and drop database before and after tests to avoid conflicts
 *    after updating clouds in tests.
 *
 **/

require('../../spec-util');
var User = require(global.config.apps.USER).User;
var App = require(global.config.apps.APP).App;
var Cloud = require(global.config.apps.CLOUD).Cloud;
var should = require('should');
var log = require(global.config.apps.LOGGING).LOG;

// These 4 user ID values should be populated in the seedCloudsToDatabase method and made available
// as convenience values for user lookup in tests
var user1Id, user2Id, user3Id, user4Id;
var app1Id, app2Id, app3Id, app4Id;
var cloud1Id, cloud2Id, cloud3Id, cloud4Id;

var numberOfClouds = 4;
var numberOfUsers = 4;
var numberOfApps = 4;

var getCloud1Id = function () {
    return cloud1Id;
};

var getCloud2Id = function () {
    return cloud2Id;
};

var getCloud3Id = function () {
    return cloud3Id;
};

var getCloud4Id = function () {
    return cloud4Id;
};

var getApp1Id = function () {
    return app1Id;
};

var getApp2Id = function () {
    return app2Id;
};

var getApp3Id = function () {
    return app3Id;
};

var getApp4Id = function () {
    return app4Id;
};

var getUser1Id = function () {
    return user1Id;
};

var getUser2Id = function () {
    return user2Id;
};

var getUser3Id = function () {
    return user3Id;
};

var getUser4Id = function () {
    return user4Id;
};


// JSON objects containing some data to populate User Models in the database
// Does not contain an ID as that will be created on insert
var sampleUsers = [
    {
        displayName: "user1",
        name: {
            familyName: "Test Family Name",
            givenName: "testGivenName",
            middleName: "_*^%$£@!"
        },
        email: "testEmail1@email.com",
        password: "testPassword"
    },
    {
        displayName: "user2",
        name: {
            familyName: "Test Family Name",
            givenName: "testGivenName",
            middleName: "_*^%$£@!"
        },
        email: "testEmail2@email.com",
        password: "testPassword"
    },
    {
        displayName: "user3",
        name: {
            familyName: "Test Family Name",
            givenName: "testGivenName",
            middleName: "_*^%$£@!"
        },
        email: "testEmail3@email.com",
        password: "testPassword"
    },
    {
        displayName: "user4",
        name: {
            familyName: "Test Family Name",
            givenName: "testGivenName",
            middleName: "_*^%$£@!"
        },
        email: "testEmail4@email.com",
        password: "testPassword"
    }
];

// JSON objects containing some data to populate Cloud Models in the database
// Does not contain an ID as that will be created on insert
// Does not contain an owner ID
// Attempting to insert this data alone will fail as does not meet data constraints
var sampleClouds = [
    {
        name: "cloud1",
        description: "A cloud owned by user1",
        icon: "some/icon.png"
    },
    {
        name: "cloud2",
        description: "A cloud owned by user2",
        icon: "some/icon.png"
    },
    {
        name: "cloud3",
        description: "A cloud owned by user3",
        icon: "some/icon.png"
    },
    {
        name: "cloud4",
        description: "A cloud owned by user4",
        icon: "some/icon.png"
    }
];

// JSON objects containing some data to populate App Models in the database
// Does not contain an ID as that will be created on insert
// Does not contain an owner ID
// Attempting to insert this data alone will fail as does not meet data constraints
var sampleApps = [
    {
        name: "app1",
        icon: "icon",
        description: "An app owned by User1",
        menuLabel: "app1 menu label",
        btnLabel: "Button label",
        settings: {},
        fields: [],
        version: 1,
        url: "app1"
    },
    {
        name: "app2",
        icon: "icon",
        description: "An app owned by User2",
        menuLabel: "app2 menu label",
        btnLabel: "Button label",
        settings: {},
        fields: [],
        version: 1,
        url: "app2"
    },
    {
        name: "app3",
        icon: "icon",
        description: "An app owned by User3",
        menuLabel: "app3 menu label",
        btnLabel: "Button label",
        settings: {},
        fields: [],
        version: 1,
        url: "app3"
    },
    {
        name: "app4",
        icon: "icon",
        description: "An app owned by User4",
        menuLabel: "app4 menu label",
        btnLabel: "Button label",
        settings: {},
        fields: [],
        version: 1,
        url: "app4"
    }
];


var seedCloudsInDatabase = function (done) {

    // TODO: verify all the properties were inserted correctly....groan..

    // Batch insert the sample users
    User.create(sampleUsers, function (err, user1, user2, user3, user4) {
        if (err) {
            return done(err);
        }
        should.exist(user1._id);
        should.exist(user2._id);
        should.exist(user3._id);
        should.exist(user4._id);
        user1Id = user1._id;
        user2Id = user2._id;
        user3Id = user3._id;
        user4Id = user4._id;
        sampleApps[0].owner = user1._id;
        sampleApps[1].owner = user2._id;
        sampleApps[2].owner = user3._id;
        sampleApps[3].owner = user4._id;
        // Batch insert the sample apps
        App.create(sampleApps, function (err, app1, app2, app3, app4) {
            if (err) {
                return done(err);
            }
            should.exist(app1._id);
            should.exist(app2._id);
            should.exist(app3._id);
            should.exist(app4._id);
            app1Id = app1._id;
            app2Id = app2._id;
            app3Id = app3._id;
            app4Id = app4._id;
            app1.owner.should.equal(user1._id);
            app2.owner.should.equal(user2._id);
            app3.owner.should.equal(user3._id);
            app4.owner.should.equal(user4._id);
            sampleClouds[0].owner = user1._id;
            sampleClouds[1].owner = user2._id;
            sampleClouds[2].owner = user3._id;
            sampleClouds[3].owner = user4._id;
            // Batch insert sample clouds
            Cloud.create(sampleClouds, function (err, cloud1, cloud2, cloud3, cloud4) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud1._id);
                should.exist(cloud2._id);
                should.exist(cloud3._id);
                should.exist(cloud4._id);
                cloud1Id = cloud1._id;
                cloud2Id = cloud2._id;
                cloud3Id = cloud3._id;
                cloud4Id = cloud4._id;
                cloud1.owner.should.equal(user1._id);
                cloud2.owner.should.equal(user2._id);
                cloud3.owner.should.equal(user3._id);
                cloud4.owner.should.equal(user4._id);
                done();
            });
        });
    });
};

module.exports = {
    getUser1Id: getUser1Id,
    getUser2Id: getUser2Id,
    getUser3Id: getUser3Id,
    getUser4Id: getUser4Id,
    getApp1Id: getApp1Id,
    getApp2Id: getApp2Id,
    getApp3Id: getApp3Id,
    getApp4Id: getApp4Id,
    getCloud1Id: getCloud1Id,
    getCloud2Id: getCloud2Id,
    getCloud3Id: getCloud3Id,
    getCloud4Id: getCloud4Id,
    sampleUsersJSONArray: sampleUsers,
    sampleAppsJSONArray: sampleApps,
    sampleCloudsJSONArray: sampleClouds,
    numberOfClouds: numberOfClouds,
    numberOfUsers: numberOfUsers,
    numberOfApps: numberOfApps,
    seedCloudsInDatabase: seedCloudsInDatabase
};