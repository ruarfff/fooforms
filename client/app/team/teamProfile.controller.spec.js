/* jshint -W117, -W030 */
describe('TeamProfileController', function () {
    var controller;
    var mockSession = mockData.getMockSession();

    beforeEach(function () {
        bard.appModule('fooforms.team');
        bard.inject('$controller', '$rootScope', '$route', '$log', 'teamService', 'session');
        session.user = mockSession.user;
        var $scope = $rootScope.$new();
        controller = $controller('TeamProfileController', {
            $scope: $scope
        });
        $scope.vm = controller;
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('TeamProfile controller', function () {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function () {
            it('should have title of "TeamProfileController"', function () {
                expect(controller.title).to.equal('TeamProfileController');
            });
        });
    });
})
;
