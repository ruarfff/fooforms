fooformsApp.factory('AuthService', function ($http, Session) {
    return {
        checkUser: function (next) {
            return $http
                .get('/api/user/loggedin')
                .then(function (res) {
                    Session.create(res.data)
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
        }
    };
});

fooformsApp.service('Session', function () {
    this.create = function (userProfile) {
        this.user = userProfile;
    };
    this.destroy = function () {
        this.user = null;
    };
    return this;
});