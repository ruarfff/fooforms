/*jslint node: true */
'use strict';

describe("will fail", function () {

    it("should fail", function () {
        var test = true;
        expect(test).toBe(false);
    });

    it("should PASS", function () {
        var test = true;
        expect(test).toBe(true);
    });

});
