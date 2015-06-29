/* global angular */

angular.module('store').factory('StoreService',
    ['$log', '$http',
        function ($log, $http) {
            'use strict';
            return {
                getStore: function () {
                    return $http.get('/api/store');
                }
            };
        }]);

angular.module('store').service('Store', function () {
    'use strict';

    return this;
});
