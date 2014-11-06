/* global angular */

angular.module('user')
    .factory('ContactService', ['$http', function ($http) {
        return {
            getContactUsForm: function () {
                return $http.get('/api/forms/545ac53e951b9c68097f77e9')
            }
        }
    }]);



