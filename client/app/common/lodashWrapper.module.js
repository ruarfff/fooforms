/**
 * Simple wrapper for injecting lodash so we don't get in to trouble with strict mode (although I haven't seen any issues yet)
 */
angular.module('lodash', [])
    .factory('_', function () {
        'use strict';
        return window._; // assumes lodash has already been loaded on the page
    });
