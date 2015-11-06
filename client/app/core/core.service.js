(function () {
    'use strict';

    angular.module('fooforms.core')
        .factory('authHttpResponseInterceptor', authHttpResponseInterceptor);

    authHttpResponseInterceptor.$inject = ['$q', '$location', '$log'];
    /* @ngInject */
    function authHttpResponseInterceptor($q, $location, $log) {
        return {
            response: function (response) {
                if (response.status === 401) {
                    $log.log("Response 401");
                    if ($location.path() !== '/signup') {
                        $location.path("/login");
                    }
                }
                return response || $q.when(response);
            },
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    $log.log("Response Error 401", rejection);
                    if ($location.path() !== '/signup') {
                        $location.path("/login");
                    }
                }
                return $q.reject(rejection);
            }
        };
    }

})();
