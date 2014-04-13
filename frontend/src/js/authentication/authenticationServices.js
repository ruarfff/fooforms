/* global angular */

angular.module('authentication').factory('AuthService', ['$cookieStore', '$http', 'Base64', 'Session', function ($cookieStore, $http, Base64, Session) {
    'use strict';
    // Load data from cookie if it's there
    $http.defaults.headers.common['Authorization'] = 'Basic ' + $cookieStore.get('authdata');
    return {
        checkUser: function (next) {
            return $http
                .get('/api/user/loggedin')
                .then(function (res) {
                    Session.create(res.data);
                    return next(Session.user);
                });
        },
        login: function (credentials) {
            return $http
                .post('/login', credentials)
                .then(function (res) {
                    Session.create(res.data);
                });
        },
        isAuthenticated: function () {
            return !!Session.user;
        },
        setCredentials: function (username, password) {
            var encoded = Base64.encode(username + ':' + password);
            $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
            $cookieStore.put('authdata', encoded);
        },
        clearCredentials: function () {
            document.execCommand("ClearAuthenticationCache");
            $cookieStore.remove('authdata');
            $http.defaults.headers.common.Authorization = 'Basic ';
        }
    };
}]);

angular.module('authentication').service('Session', function () {
    'use strict';
    this.create = function (userProfile) {
        this.user = userProfile;
    };
    this.destroy = function () {
        this.user = null;
    };
    return this;
});
