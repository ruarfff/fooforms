/* jshint -W117, -W030 */
describe('MainController', function () {
    var controller;

    beforeEach(function () {
        bard.appModule('fooforms.core');
        bard.inject('$controller', '$rootScope', 'session');
        var $scope = $rootScope.$new();
        controller = $controller('MainController', {
            $scope: $scope
        });
        $scope.vm = controller;
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Main controller', function () {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function () {
            it('should have title of "MainController"', function () {
                expect(controller.title).to.equal('MainController');
            });
        });
    });
})
;
