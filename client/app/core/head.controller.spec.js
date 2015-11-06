/* jshint -W117, -W030 */
describe('HeadController', function () {
    var controller;

    beforeEach(function () {
        bard.appModule('fooforms.core');
        bard.inject('$controller');
        controller = $controller('HeadController');
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Head controller', function () {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function () {
            it('should have title of "HeadController"', function () {
                expect(controller.title).to.equal('HeadController');
            });

            it('should have stylesheet "bootstrap"', function () {
                expect(controller.stylesheet).to.equal('bootstrap');
            });
        });
    });
});
