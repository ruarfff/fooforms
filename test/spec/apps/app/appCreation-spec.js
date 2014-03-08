/*jslint node: true */
'use strict';
var assert = require("assert");

describe("creating apps", function () {

    it("is good", function () {
        var test = true;
        assert.equal(test, true);
    });

    //pending
    describe('Pending', function () {
        describe('Some Test', function () {
            it('should be pending')
        })
    })

});
