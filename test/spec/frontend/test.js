/*jslint node: true */
/* global describe, it, expect */
'use strict';

describe('Basic testing', function() {
    describe('test', function () {
        it('should pass', function () {

            expect("test").toBe('test');
        });
    });
});