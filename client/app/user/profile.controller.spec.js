/* jshint -W117, -W030 */
describe('ProfileController', function () {
    var controller;

    beforeEach(function () {
        bard.appModule('fooforms.user');
        bard.inject('$controller', '$rootScope', '$log', 'Restangular', 'SweetAlert', 'session');
        var $scope = $rootScope.$new();
        controller = $controller('ProfileController', {
            $scope: $scope
        });
        $scope.vm = controller;
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Profile controller', function () {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function () {
            it('should have title of "ProfileController"', function () {
                expect(controller.title).to.equal('ProfileController');
            });
        });
    });
})
;
