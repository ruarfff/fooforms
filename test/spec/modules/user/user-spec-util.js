/*jslint node: true */
'use strict';

var mockValidUsers = [];
var mockInvalidUsers = [];

var mockValidUser = {};
var mockInvalidUser = {};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var resetUsers = function () {
    mockValidUsers = [
        {
            name: {
                familyName: "Test Family Name",
                givenName: "testGivenName",
                middleName: "_*^%$£@!"
            },
            displayName: "Happy",
            email: "anemail@email.com",
            password: "AVerySecurePassword123"
        },
        {
            name: {
                familyName: "Joe",
                givenName: "John",
                middleName: "Harry"
            },
            displayName: "sample-user",
            email: "testEmail1@email.com",
            password: "testPassword"
        },
        {
            name: {
                familyName: "Maryijshdsdhfsfhjksdjfh",
                givenName: "nsdknsdjknejew8973928e938",
                middleName: "jhdkjshfkjh kj n jjnjk "
            },
            displayName: "asampleusernamewithNum395",
            email: "averylongemailaddress-938474_iohijoijojio@email.com",
            password: "averylongtestPassword2983798749872398792837923874938274983798"
        },
        {
            name: {
                familyName: "£hihiuhui",
                givenName: "0909823498",
                middleName: "23872873"
            },
            displayName: "489u9289388923",
            email: "11229lalalalallal@email.co.uk",
            password: "testPassword_&**&^%^*&£%$&"
        }
    ];

    mockInvalidUsers = [
        {
            name: {
                familyName: "Test Family Name",
                givenName: "testGivenName",
                middleName: "_*^%$£@!"
            },
            displayName: "Happy",
            password: "AVerySecurePassword123"
        },
        {
            name: {
                familyName: "Joe",
                givenName: "John",
                middleName: "Harry"
            },
            displayName: "sample`&%$&^$^%$*^%$^%E&%$£&$%^$*/////-user",
            email: "testEmail1@email.com",
            password: "testPassword"
        },
        {
        },
        {
            name: {
                familyName: "£hihiuhui",
                givenName: "0909823498",
                middleName: "23872873"
            },
            email: "11229lalalalallal@email.co.uk",
            password: "testPassword_&**&^%^*&£%$&"
        }
    ];

    mockValidUser = mockValidUsers[getRandomInt(0, mockValidUsers.length - 1)];
    mockInvalidUser = mockInvalidUsers[getRandomInt(0, mockInvalidUsers.length - 1)];
};

var getMockValidUser = function() {
    resetUsers();
    return mockValidUser;
};

var getMockInvalidUser = function() {
    resetUsers();
    return mockInvalidUser;
}

module.exports = {
    getMockValidUser: getMockValidUser,
    getMockInvalidUser: getMockInvalidUser
};



