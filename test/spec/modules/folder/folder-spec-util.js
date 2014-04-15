/*jslint node: true */
'use strict';

/**
 *
 *    This file contains a bunch of sample data purely to help with Folder database tests.
 *    A lot of it may be fairly confusing but right now, can't think of a better way to do this.
 *
 *    The JSON data is some placeholder values to help with inserting objects in to the database.
 *    This can be used externally but the main use of this module is in the seedFoldersInDatabase method.
 *
 *    Calling seedFoldersInDatabase will insert 4 Users, 4 Forms and 4 Folders ot the Database.
 *    These are populated with the JSON data contained in this file.
 *    User1 is the owner of Form1 and Folder 1, User2 is the owner of Form2 and Folder2 and so on...
 *    This should be enough sample data to help testing most scenarios.
 *    Setting up member and permissions as well as adding Forms to Folders should be done in
 *    individual tests.
 *    Use spec-util.js methods to connect and drop database before and after tests to avoid conflicts
 *    after updating folders in tests.
 *
 **/

require('../../spec-util');
var User = require(global.config.modules.USER).User;
var Form = require(global.config.modules.FORM).Form;
var Folder = require(global.config.modules.FOLDER).Folder;
var should = require('should');
var log = require(global.config.modules.LOGGING).LOG;

// These 4 user ID values should be populated in the seedFoldersToDatabase method and made available
// as convenience values for user lookup in tests
var user1Id, user2Id, user3Id, user4Id;
var form1Id, form2Id, form3Id, form4Id;
var folder1Id, folder2Id, folder3Id, folder4Id;

var numberOfFolders = 4;
var numberOfUsers = 4;
var numberOfForms = 4;

var getFolder1Id = function () {
    return folder1Id;
};

var getFolder2Id = function () {
    return folder2Id;
};

var getFolder3Id = function () {
    return folder3Id;
};

var getFolder4Id = function () {
    return folder4Id;
};

var getForm1Id = function () {
    return form1Id;
};

var getForm2Id = function () {
    return form2Id;
};

var getForm3Id = function () {
    return form3Id;
};

var getForm4Id = function () {
    return form4Id;
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

// JSON objects containing some data to populate Folder Models in the database
// Does not contain an ID as that will be created on insert
// Does not contain an owner ID
// Attempting to insert this data alone will fail as does not meet data constraints
var sampleFolders = [
    {
        name: "folder1",
        description: "A folder owned by user1",
        icon: "some/icon.png"
    },
    {
        name: "folder2",
        description: "A folder owned by user2",
        icon: "some/icon.png"
    },
    {
        name: "folder3",
        description: "A folder owned by user3",
        icon: "some/icon.png"
    },
    {
        name: "folder4",
        description: "A folder owned by user4",
        icon: "some/icon.png"
    }
];

// JSON objects containing some data to populate Form Models in the database
// Does not contain an ID as that will be created on insert
// Does not contain an owner ID
// Attempting to insert this data alone will fail as does not meet data constraints
var sampleForms = [
    {
        name: "form1",
        icon: "icon",
        description: "An form owned by User1",
        menuLabel: "app1 menu label",
        btnLabel: "Button label",
        settings: {},
        fields: [],
        version: 1,
        url: "form1"
    },
    {
        name: "form2",
        icon: "icon",
        description: "An form owned by User2",
        menuLabel: "app2 menu label",
        btnLabel: "Button label",
        settings: {},
        fields: [],
        version: 1,
        url: "form2"
    },
    {
        name: "form3",
        icon: "icon",
        description: "An form owned by User3",
        menuLabel: "app3 menu label",
        btnLabel: "Button label",
        settings: {},
        fields: [],
        version: 1,
        url: "form3"
    },
    {
        name: "form4",
        icon: "icon",
        description: "A form owned by User4",
        menuLabel: "app4 menu label",
        btnLabel: "Button label",
        settings: {},
        fields: [],
        version: 1,
        url: "form4"
    }
];


var seedFoldersInDatabase = function (done) {

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
        sampleForms[0].owner = user1._id;
        sampleForms[1].owner = user2._id;
        sampleForms[2].owner = user3._id;
        sampleForms[3].owner = user4._id;
        // Batch insert the sample forms
        Form.create(sampleForms, function (err, form1, form2, form3, form4) {
            if (err) {
                return done(err);
            }
            should.exist(form1._id);
            should.exist(form2._id);
            should.exist(form3._id);
            should.exist(form4._id);
            form1Id = form1._id;
            form2Id = form2._id;
            form3Id = form3._id;
            form4Id = form4._id;
            form1.owner.should.equal(user1._id);
            form2.owner.should.equal(user2._id);
            form3.owner.should.equal(user3._id);
            form4.owner.should.equal(user4._id);
            sampleFolders[0].owner = user1._id;
            sampleFolders[1].owner = user2._id;
            sampleFolders[2].owner = user3._id;
            sampleFolders[3].owner = user4._id;
            // Batch insert sample folders
            Folder.create(sampleFolders, function (err, folder1, folder2, folder3, folder4) {
                if (err) {
                    return done(err);
                }
                should.exist(folder1._id);
                should.exist(folder2._id);
                should.exist(folder3._id);
                should.exist(folder4._id);
                folder1Id = folder1._id;
                folder2Id = folder2._id;
                folder3Id = folder3._id;
                folder4Id = folder4._id;
                folder1.owner.should.equal(user1._id);
                folder2.owner.should.equal(user2._id);
                folder3.owner.should.equal(user3._id);
                folder4.owner.should.equal(user4._id);
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
    getForm1Id: getForm1Id,
    getForm2Id: getForm2Id,
    getForm3Id: getForm3Id,
    getForm4Id: getForm4Id,
    getFolder1Id: getFolder1Id,
    getFolder2Id: getFolder2Id,
    getFolder3Id: getFolder3Id,
    getFolder4Id: getFolder4Id,
    sampleUsersJSONArray: sampleUsers,
    sampleFormsJSONArray: sampleForms,
    sampleFoldersJSONArray: sampleFolders,
    numberOfFolders: numberOfFolders,
    numberOfUsers: numberOfUsers,
    numberOfForms: numberOfForms,
    seedFoldersInDatabase: seedFoldersInDatabase
};