'use strict';

/* Filters */

// Filter app fields based on category
fooformsApp.filter('filterTypes', function () {

    return function (inputs, category) {
        var standard = ["text", "textarea", "email", "select", "checkbox", "radio", "paragraph", "date", "groupbox"];
        var numbers = ["number", "calculation", "currency", "sum", "payment", "progress"];
        var people = ["to", "user" , "signature", "profile", "activity"];
        var advanced = ["status", "labels", "html", "groupBox", "rating", "canvas", "button"];

        // The filter array to be assigned based on the category
        var categoryFilter;

        var filtered = [];
        try {
            // TODO: remove logging
            console.log('filterTypes', arguments);

            switch (category) {
                case "standard" :
                    categoryFilter = standard;
                    break;
                case "number" :
                    categoryFilter = numbers;
                    break;
                case "people" :
                    categoryFilter = people;
                    break;
                case "advanced" :
                    categoryFilter = advanced;
                    break;
                default :
                    return inputs; // If no category, might as well not filter
                    break;
            }

            if (categoryFilter) {
                angular.forEach(inputs, function (input) {
                    // Check if input type exists in categoryFilter array
                    if (categoryFilter.indexOf(input.type) > -1) {
                        filtered.push(input);
                    }
                });
            }
        } catch (err) {
            // TODO: What to do if some error? Maybe just return all inputs?
            console.err(err.toString());
        }
        return filtered;
    }

});


