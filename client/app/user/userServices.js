angular.module('user')
    .factory('ContactService', ['$http', function ($http) {
        'use strict';
        return {
            getContactUsForm: function () {
                return $http.get('/api/forms/545ac53e951b9c68097f77e9')
            }
        }
    }]);



