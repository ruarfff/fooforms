/* global angular */

angular.module('post')
    .filter('status', function () {
        return function (post) {
            return true;
        }
    });
