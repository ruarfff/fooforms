/* jshint -W117, -W030 */
describe('UserViewController', function () {
    var controller;

    beforeEach(function () {
        bard.appModule('fooforms.user');
        bard.inject('$controller', '$rootScope');
        controller = $controller('UserViewController');
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('UserView controller', function () {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function () {
            it('should have title of "UserViewController"', function () {
                expect(controller.title).to.equal('UserViewController');
            });
        });
    });
})
;
