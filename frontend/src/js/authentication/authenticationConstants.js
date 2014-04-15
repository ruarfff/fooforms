/* global angular */

angular.module('authentication').constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    user: 'user'
});
angular.module('authentication').constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
});
