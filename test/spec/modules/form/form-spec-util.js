/*jslint node: true */
'use strict';

var mockValidForms = [];
var mockInvalidForms = [];
var mockValidPosts = [];
var mockInvalidPosts = [];

var mockValidForm = {};
var mockInvalidForm = {};
var mockValidPost = {};
var mockInvalidPost = {};


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var resetForms = function () {
    mockValidForms = [
        {
            name: "Some Form",
            icon: "An Icon",
            description: "Cool Form",
            menuLabel: "MenuLabel",
            btnLabel: "Btn",
            settings: {},
            fields: [],
            formEvents: [],
            sharing: {test: 'test'},
            privileges: 'none'
        },
        {
            name: "Some Other Form",
            icon: "An Icon hiuhuiohiouhoi",
            description: "Cool Form874365897687^(*&^(&^%^&(",
            menuLabel: "MenuLabeljoihopu9ph98h89",
            btnLabel: "Btndjjdknfkjsnf",
            settings: {aSetting: "somesetting", anotherSetting: "someothersetting"},
            fields: [ {}, {}, {} ],
            formEvents: [],
            sharing: {thing: 1},
            privileges: 'some'
        },
        {
            name: "Some98908798&)(*&)*(& Form",
            icon: "An(U(HPIUHIUH Icon",
            description: "Cool __(@*)£*_Y(PUGIHJ:Form",
            menuLabel: "MenuLa*OG*&GEIDG£bel",
            btnLabel: "Btwedwefwefewfn",
            settings: {aSetting: "somesetting", anotherSetting: "someothersetting", isaSetting: "somesetting", notanotherSetting: "someothersetting", notASetting: "somesetting", yetAnotherSetting: "someothersetting"},
            fields: [ {}, {} , {}, {}, "", "" ],
            formEvents: [ {}, {} ],
            sharing: {testing: '1', two: 'three'},
            privileges: 'all'
        },
        {
            name: "Some Form",
            icon: "An Icon",
            description: "Cool Form werwerwerwrw\\e/?/?/?/p",
            menuLabel: "MenuLabel      wefrw erw wer",
            btnLabel: "Btn___              90909 ",
            settings: {},
            fields: [],
            formEvents: [ {} ],
            sharing: {},
            privileges: 'loads'
        }
    ];

    mockInvalidForms = [
        {
            icon: "An Icon",
            description: "Cool Form",
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
            description: "Cool Form",
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
            description: "Cool Form",
            menuLabel: "MenuLabel",
            btnLabel: "Btn",
            settings: {},
            fields: [],
            formEvents: [],
            sharing: {},
            privileges: ''
        }
    ];

    mockValidForm = mockValidForms[getRandomInt(0, mockValidForms.length - 1)];
    mockInvalidForm = mockInvalidForms[getRandomInt(0, mockInvalidForms.length - 1)];
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

var getMockValidForm = function() {
    resetForms();
    return mockValidForm;
};

var getMockInvalidForm = function() {
    resetForms();
    return mockInvalidForm;
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
    getMockValidForm: getMockValidForm,
    getMockInvalidForm: getMockInvalidForm,
    getMockValidPost: getMockValidPost,
    getMockInvalidPost: getMockInvalidPost
};



