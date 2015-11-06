angular.module('fooforms.invite')

    .factory('InviteService', ['$log', 'Restangular', function ($log, Restangular) {
        'use strict';
        var inviteApi = Restangular.all('invite');

        return {
            createInvitation: function (invite, next) {
                inviteApi.post(invite).then(function (invite) {
                    next(null, invite);
                }, function (err) {
                    $log.error(err);
                    return next(err);
                });
            },
            getInvitation: function (id) {
                return inviteApi.get(id);
            }
        }

    }]);
