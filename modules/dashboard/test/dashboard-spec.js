/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId();
var mockgoose = require('mockgoose');
mockgoose(mongoose);

// Keep the logger happy TODO: Make this better when I don't have so much stuff to do
global.config = {};
global.config.root = '../../../';

var request = require('supertest');
var express = require('express');
var bodyParser = require('body-parser');
var should = require('should');
var rootUrls = require(global.config.root + '/config/rootUrls');
var dashboardRoutes = require('../routes/dashboardRoutes');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var dashboardRootUrl = '/' + rootUrls.dashboard;

app.use(dashboardRootUrl, dashboardRoutes);

