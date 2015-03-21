/* global angular */

angular.module('authentication')
    .factory('AuthService', ['$rootScope', '$cookieStore', '$http', 'Base64', 'Session', 'AUTH_EVENTS', function ($rootScope, $cookieStore, $http, Base64, Session, AUTH_EVENTS) {
        'use strict';
        return {
            login: function () {
                return $http
                    .post('/login');
            },
            signup: function (details) {
                return $http
                    .post('/signup', details);
            },
            isAuthenticated: function () {
                return !!Session.user;
            },
            checkStoredCredentials: function (next) {
                var encoded = $cookieStore.get('authdata');
                if (encoded) {
                    $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
                    return $http
                        .get('/api/users/check/me')
                        .success(function (data) {
                            Session.create(data);
                            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                            next(null, data);
                        })
                        .error(function (data, status) {
                            document.execCommand("ClearAuthenticationCache");
                            $cookieStore.remove('authdata');
                            $http.defaults.headers.common.Authorization = 'Basic ';
                            next(data + ' - ' + status);
                        });
                } else {
                    next('Login required.');
                }
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
    }])
    .factory('PasswordService', ['$log', 'Restangular', function ($log, Restangular) {
        return {
            sendReset: function (email, next) {
                var forgottenPasswordApi = Restangular.all('forgotten-password');
                forgottenPasswordApi.post({email: email}).then(function () {
                    next();
                }, function (err) {
                    $log.error(err);
                    return next(err);
                });
            },
            updatePassword: function (args, next) {
                $log.debug(JSON.stringify(args));
                var resetPasswordApi = Restangular.all('reset-password');
                resetPasswordApi.post(args).then(function (data) {
                    $log.debug(JSON.stringify(data));
                    next(data);
                }, function (err) {
                    $log.error(err);
                    next(err);
                })
            }
        }

    }])
    .service('Session', function () {
        'use strict';
        this.posts = [];
        this.org = {};
        this.forms=[];
        this.create = function (userProfile) {
            this.user = userProfile;
        };
        this.destroy = function () {
            this.user = null;
            this.posts = null;
        };
        return this;
    })
    .factory('Base64', function () {
        "use strict";
        var keyStr = 'ABCDEFGHIJKLMNOP' +
            'QRSTUVWXYZabcdef' +
            'ghijklmnopqrstuv' +
            'wxyz0123456789+/' +
            '=';
        return {
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;
            },

            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";

                } while (i < input.length);

                return output;
            }
        };
    });
