(function () {
    'use strict';
    angular
        .module('fooforms.core')
        .config(configure);

    configure.$inject = ['$httpProvider', 'RestangularProvider'];

    /* @ngInject */
    function configure($httpProvider, RestangularProvider) {

        $httpProvider.interceptors.push('authHttpResponseInterceptor');

        RestangularProvider.setBaseUrl('/api');

        RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});
        RestangularProvider.setRestangularFields({
            id: "_id",
            selfLink: 'self.link'
        });
        RestangularProvider.addResponseInterceptor(function (data, operation) {
            var extractedData;
            if (operation === "getList" && data.data) {
                // .. and handle the data and meta data
                extractedData = data.data;
                extractedData.has_more = data.has_more;
                extractedData.objectType = data.object;
            } else {
                extractedData = data;
            }
            return extractedData;
        });
    }

})();
