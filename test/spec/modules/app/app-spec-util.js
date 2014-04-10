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
            formEvents: [],
            sharing: {test: 'test'},
            privileges: 'none'
        },
        {
            name: "Some Other App",
            icon: "An Icon hiuhuiohiouhoi",
            description: "Cool App874365897687^(*&^(&^%^&(",
            menuLabel: "MenuLabeljoihopu9ph98h89",
            btnLabel: "Btndjjdknfkjsnf",
            settings: {aSetting: "somesetting", anotherSetting: "someothersetting"},
            fields: [ {}, {}, {} ],
            formEvents: [],
            sharing: {thing: 1},
            privileges: 'some'
        },
        {
            name: "Some98908798&)(*&)*(& App",
            icon: "An(U(HPIUHIUH Icon",
            description: "Cool __(@*)£*_Y(PUGIHJ:App",
            menuLabel: "MenuLa*OG*&GEIDG£bel",
            btnLabel: "Btwedwefwefewfn",
            settings: {aSetting: "somesetting", anotherSetting: "someothersetting", isaSetting: "somesetting", notanotherSetting: "someothersetting", notASetting: "somesetting", yetAnotherSetting: "someothersetting"},
            fields: [ {}, {} , {}, {}, "", "" ],
            formEvents: [ {}, {} ],
            sharing: {testing: '1', two: 'three'},
            privileges: 'all'
        },
        {
            name: "Some App",
            icon: "An Icon",
            description: "Cool Ap werwerwerwrw\\e/?/?/?/p",
            menuLabel: "MenuLabel      wefrw erw wer",
            btnLabel: "Btn___              90909 ",
            settings: {},
            fields: [],
            formEvents: [ {} ],
            sharing: {},
            privileges: 'loads'
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
            formEvents: [],
            sharing: {},
            privileges: ''
        },
        {
            icon: "An Icon",
            description: "Cool App",
            menuLabel: "MenuLabel",
            btnLabel: "Btn",
            settings: {},
            fields: [],
            formEvents: [],
            sharing: {},
            privileges: ''
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
            formEvents: [],
            sharing: {},
            privileges: ''
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
            fields: [ {}, {} , "" ]
        },
        {
            name: "kjhksjfh^(&(&^%^(&",
            description: "Some Description&(*(*OIHidjhweifhwipuehfpiweuhfpiwefgepwiu",
            icon: "http://www.lkefnlkrfnrlkfnlrekfnrefnoifr.com/it.png",
            menuLabel: "MenuLabelslknwflkwelkfjwekfjewpoijfo2ij4roi234jfoiewjfoijfoi43jfoi43jfoi3fj43oifjoi3fjnfion",
            fields: [ {}, {}, {}, {}, {} ]
        },
        {
            name: "S",
            description: "n",
            icon: "n",
            menuLabel: "l",
            fields: [ {} ]
        },
        {
            name: "Some                           Name",
            description: "Some                                       Description",
            icon: "Some                       Icon",
            menuLabel: "Menu                              Label",
            fields: [ ]
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



