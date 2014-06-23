/*jslint node: true */
/* global describe, browser, it, expect */
'use strict';

describe('Basic testing of index page', function() {
    describe('index', function () {
        it('should display the correct title', function () {
            browser.ignoreSynchronization = true; // Nasty hack for non angular page testing
            browser.get('/');
            expect(browser.getTitle()).toBe('FooForms - Development');
            browser.ignoreSynchronization = false;
        });
    });
});