/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var env = process.env.NODE_ENV || "development";
process.env.NODE_ENV = 'test'; // Setting NODE_ENV to test ensures the test config (/config/env/test.json) gets loaded
global.config = require('../../../config/config')(); // Load the test config and assign it to global
var database = require(global.config.modules.DATABASE)();
var mongoose = require('mongoose');
// Nasty hack for testing with mocha -w ... see: https://github.com/LearnBoost/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var tearDown = function () {
    global.config = {}; // Make sure no test configurations remain loaded.
    process.env.NODE_ENV = env; // Switch back the NODE_ENV to whatever it was before the tests were run.
};


var dropDatabase = function (done) {
    mockgoose.reset();
    return done();
};

before(function (done) {
    dropDatabase(done);
});

after(function () {
    tearDown();
});


module.exports = {
    database: database,
    dropDatabase: dropDatabase
};
