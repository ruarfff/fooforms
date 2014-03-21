/*jslint node: true */
'use strict';

var mockValidApps = [];
var mockInvalidApps = [];
var mockValidPosts = [];
var mockInvalidPosts = [];

var mockValidApp = {};
var mockInvalidApp = {};
var mockValidPost = {};
var mockInvalidPost = {};


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var resetApps = function () {
    mockValidApps = [
        {
            name: "Some App",
            icon: "An Icon",
            description: "Cool App",
            menuLabel: "MenuLabel",
            btnLabel: "Btn",
            settings: {},
            fields: [],
            version: 1,
            created: new Date(),
            lastModified: new Date()
        },
        {
            name: "Some Other App",
            icon: "An Icon hiuhuiohiouhoi",
            description: "Cool App874365897687^(*&^(&^%^&(",
            menuLabel: "MenuLabeljoihopu9ph98h89",
            btnLabel: "Btndjjdknfkjsnf",
            settings: {aSetting: "somesetting", anotherSetting: "someothersetting"},
            fields: [ {}, {}, {} ],
            version: 1,
            created: new Date(),
            lastModified: new Date()
        },
        {
            name: "Some98908798&)(*&)*(& App",
            icon: "An(U(HPIUHIUH Icon",
            description: "Cool __(@*)£*_Y(PUGIHJ:App",
            menuLabel: "MenuLa*OG*&GEIDG£bel",
            btnLabel: "Btwedwefwefewfn",
            settings: {aSetting: "somesetting", anotherSetting: "someothersetting", isaSetting: "somesetting", notanotherSetting: "someothersetting", notASetting: "somesetting", yetAnotherSetting: "someothersetting"},
            fields: [ {}, {} , {}, {}, "", "" ],
            version: 1,
            created: new Date(),
            lastModified: new Date()
        },
        {
            name: "Some App",
            icon: "An Icon",
            description: "Cool Ap werwerwerwrw\\e/?/?/?/p",
            menuLabel: "MenuLabel      wefrw erw wer",
            btnLabel: "Btn___              90909 ",
            settings: {},
            fields: [],
            version: 232,
            created: new Date(),
            lastModified: new Date()
        }
    ];

    mockInvalidApps = [
        {
            icon: "An Icon",
            description: "Cool App",
            menuLabel: "MenuLabel",
            btnLabel: "Btn",
            settings: {},
            fields: [],
            version: 1,
            created: new Date(),
            lastModified: new Date()
        },
        {
            icon: "An Icon",
            description: "Cool App",
            menuLabel: "MenuLabel",
            btnLabel: "Btn",
            settings: {},
            fields: [],
            version: 1,
            created: new Date(),
            lastModified: new Date()
        },
        {
        },
        {
            icon: "An Icon",
            description: "Cool App",
            menuLabel: "MenuLabel",
            btnLabel: "Btn",
            settings: {},
            fields: [],
            version: 1,
            created: new Date(),
            lastModified: new Date()
        }
    ];

    mockValidApp = mockValidApps[getRandomInt(0, mockValidApps.length - 1)];
    mockInvalidApp = mockInvalidApps[getRandomInt(0, mockInvalidApps.length - 1)];
};

var resetPosts = function () {
    mockValidPosts = [
        {
            name: "Some Name",
            description: "Some Description",
            icon: "Some Icon",
            menuLabel: "MenuLabel",
            fields: {}
        }

    ];
    mockInvalidPosts = [{}];
    mockValidPost = mockValidPosts[getRandomInt(0, mockValidPosts.length - 1)];
    mockInvalidPost = mockInvalidPosts[getRandomInt(0, mockInvalidPosts.length - 1)];
};

var getMockValidApp = function() {
    resetApps();
    return mockValidApp;
};

var getMockInvalidApp = function() {
    resetApps();
    return mockInvalidApp;
};

var getMockValidPost = function() {
    resetPosts();
    return mockValidPost;
};

var getMockInvalidPost = function() {
    resetPosts();
    return mockInvalidPost;
};

module.exports = {
    getMockValidApp: getMockValidApp,
    getMockInvalidApp: getMockInvalidApp,
    getMockValidPost: getMockValidPost,
    getMockInvalidPost: getMockInvalidPost
};



