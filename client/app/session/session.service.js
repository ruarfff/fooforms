(function () {
    'use strict';

    angular.module('fooforms.session')
        .factory('sessionService', sessionService)
        .service('session', session);


    sessionService.$inject = ['$location', '$q', '$log', '_', 'authService', 'dashboardService', 'organisationService', 'session'];

    /* @ngInject */
    function sessionService($location, $q, $log, _, authService, dashboardService, organisationService, session) {
        return {
            checkSession: function () {
                var deferred = $q.defer();
                if (!authService.isAuthenticated()) {
                    authService.checkStoredCredentials(function (err) {
                        if (err) {
                            $log.log(err);
                        }
                        if (!authService.isAuthenticated()) {
                            if ($location.path() !== '/signup') {
                                $location.path("/login");
                            }
                        } else {
                            dashboardService.getUserDashboard(function (err, result) {
                                if (err) {
                                    $log.error(err);
                                } else {
                                    if (!result.photo) {
                                        result.photo = '/assets/images/photo.jpg';
                                    }
                                    result.self = {};
                                    result.self.link = '/api/users/' + result._id;
                                    session.user = result;

                                    _.forEach(session.user.organisations, function (organisation) {
                                        organisation.teams = _.filter(session.user.teams, {organisation: organisation._id});
                                    });


                                    session.org = angular.copy(session.user.organisations[0]);
                                    organisationService.getMembers(session.user.organisations[0], function (err, members) {
                                        session.org.members = members;
                                        for (var i = 0; i < session.org.members.length; i++) {
                                            // This is to allow Restangular do put & remove on these objects.
                                            session.org.members[i].self = {};
                                            session.org.members [i].self.link = '/api/users/' + session.org.members[i]._id;
                                        }
                                    });


                                    deferred.resolve(session.user);
                                }
                            });
                        }
                    });
                } else {
                    deferred.resolve(session.user);
                }
                return deferred.promise;
            }
        }
    }

    session.$inject = [];

    /* @ngInject */
    function session() {
        'use strict';
        this.posts = [];
        this.org = {};
        this.forms = [];
        this.create = function (userProfile) {
            this.user = userProfile;
        };
        this.destroy = function () {
            this.user = null;
            this.posts = null;
        };
        return this;
    }

})();
