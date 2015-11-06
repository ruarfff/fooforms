angular.module('fooforms.formBuilder')
    .filter('filterTypes', function () {
        'use strict';
        return function (inputs, category) {
            var standard = ["text", "textarea",  "select", "checkbox", "radio", "heading", "paragraph", "date", "progress"];
            var numbers = ["number", "calculation","sum", "currency", "progress"];
            var files = ["file", "image"];
            var people = ["givenName", "middleName", "familyName", "email", "phone", "mobile", "address", "company",  "to"];
            var advanced = ["status", "html", "groupBox","table"];
            var events = ["statusChange", "newPost", "updatePost"];

            // The filter array to be assigned based on the category
            var categoryFilter;

            var filtered = [];
            try {
                switch (category) {
                    case "standard" :
                        categoryFilter = standard;
                        break;
                    case "number" :
                        categoryFilter = numbers;
                        break;
                    case "files" :
                        categoryFilter = files;
                        break;
                    case "user" :
                        categoryFilter = people;
                        break;
                    case "advanced" :
                        categoryFilter = advanced;
                        break;
                    case "events" :
                        categoryFilter = events;
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
        };

    });


