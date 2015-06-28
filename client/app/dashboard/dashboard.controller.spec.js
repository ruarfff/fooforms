/* jshint -W117, -W030 */
describe('DashboardController', function () {
    var controller;
    // mockData made available through client/test-helpers
    var mockSession = mockData.getMockSession();
    beforeEach(function () {
        bard.appModule('fooforms.dashboard');
        bard.inject('$controller', '$rootScope', '$routeParams', '$log', '$timeout', '$window', 'SweetAlert', 'Restangular', 'session', 'postService');
        session.user = mockSession.user;
        var $scope = $rootScope.$new();
        controller = $controller('DashboardController', {
            $scope: $scope
        });
        $scope.vm = controller;
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Dashboard controller', function () {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function () {
            it('should have title of Dashboard', function () {
                expect(controller.title).to.equal('Dashboard');
            });
        });
    });
});
