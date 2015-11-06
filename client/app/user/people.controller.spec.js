/* jshint -W117, -W030 */
describe('PeopleController', function () {
    var controller;

    beforeEach(function () {
        bard.appModule('fooforms.user');
        bard.inject('$controller', '$rootScope', '$http');
        var $scope = $rootScope.$new();
        controller = $controller('PeopleController', {
            $scope: $scope
        });
        $scope.vm = controller;
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('People controller', function () {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function () {
            it('should have title of "PeopleController"', function () {
                expect(controller.title).to.equal('PeopleController');
            });
        });
    });
})
;
