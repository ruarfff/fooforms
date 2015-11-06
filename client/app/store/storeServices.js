angular.module('fooforms.store').factory('storeService',
    ['$log', '$http',
        function ($log, $http) {
            'use strict';
            return {
                getStore: function () {
                    return $http.get('/api/store');
                }
            };
        }]);

angular.module('fooforms.store').service('store', function () {
    'use strict';

    return this;
});
