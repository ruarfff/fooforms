'use strict';

/* Services */


fooformsApp.service('CalculatorService', function (MathService) {

    this.square = function (a) {
        return MathService.multiply(a, a);
    };
    this.cube = function (a) {
        return MathService.multiply(a, MathService.multiply(a, a));
    };

});