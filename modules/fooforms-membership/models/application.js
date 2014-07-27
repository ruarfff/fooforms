"use strict";


var Application = function (args) {
    var app = {};
    app.displayName = args.displayName;
    app.email = args.email;
    app.password = args.password;
    app.confirmPass = args.confirmPass;
    app.status = 'pending';
    app.message = null;
    app.user = null;

    app.isValid = function () {
        return app.status === 'validated';
    };

    app.setInvalid = function (message) {
        app.status = 'invalid';
        if(message) {app.message = message;}
    };

    app.validate = function () {
        app.status = 'validated';
    };

    return app;
};

module.exports = Application;