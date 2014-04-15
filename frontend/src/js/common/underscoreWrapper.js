/* global angular */


/**
 * Simple wrapper for injecting underscore so we don't get in to trouble with strict mode (although I haven't seen any issues yet)
 */
var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
    'use strict';
    return window._; // assumes underscore has already been loaded on the page
});