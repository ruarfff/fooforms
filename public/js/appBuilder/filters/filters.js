'use strict';

/* Filters */

angular.module('appBuilderFilters', []).filter(['filterTypes', function () {

    return function (input, category) {
        var standard = ["text", "textarea", "select", "checkbox", "radio", "paragraph", "html", "groupbox"];
        var numbers = ["number", "calculation"];
        var people = ["people", "to"];

        var filtered = [];

        input.forEach(function (inputType) {

            switch (category) {

                case "standard" :
                    if (inputType.type == standard) {

                        filtered.push(inputType);
                    }
                    break;
                case "number" :
                    if (inputType.type == numbers) {

                        filtered.push(inputType);
                    }
                    break;
            }

        })
        // conditional based on optional argument

        return filtered;
    }

}]);


