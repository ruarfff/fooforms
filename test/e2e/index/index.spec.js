/*jslint node: true */
/* global describe, browser, it, expect */
'use strict';

describe('Basic testing of index page', function() {
    describe('index', function () {
        it('should display the correct title', function () {
            browser.get('/');
            expect(browser.getTitle()).toBe('Fooforms');
        });
    });
});