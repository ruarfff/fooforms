/*jslint node: true */
'use strict';

var path = require('path');

var viewDir = path.join(global.config.modules.FORMVIEWER, 'views');
var authenticator = require(global.config.modules.AUTHENTICATION);
var errorResponseHandler = require('fooforms-rest').errorResponseHandler;
var log = require('fooforms-logging').LOG;


var routes = function (app, passport) {

    /*********************************************************************************
     *  View Handling
     *********************************************************************************/


    app.get('/partials/formViewer', passport.authenticate('basic', { session: false }), function (req, res) {
        res.render(viewDir + '/index');
    });

    /*********************************************************************************
     *  Embedded Form Retrieval
     *********************************************************************************/

    app.post('/forms/repo/post', function (req, res) {
        try {
            require(global.config.modules.FORM + '/api/postApi').create(req, res);
        } catch (err) {
            errorResponseHandler.handleError(res, err);
        }
    });

    app.get('/forms/repo/:form', function (req, res) {
        require(global.config.modules.FORM).getFormById(req.params.form, function (err, form) {
            if (err) {
                errorResponseHandler.handleError(res, err);
            }
            else if (!form) {
                err = new Error('form not found');
                err.http_code = 404;
                errorResponseHandler.handleError(res, err);
            } else {
                res.render(viewDir + '/embeddedForm', {
                    formId: form._id,
                    formName: form.name
                });
            }
        });
    });

    app.get('/forms/repo/fetch/:form', function (req, res) {
        require(global.config.modules.FORM + '/api/formApi').getFormById(req.params.form, res);
    });

};


module.exports = routes;
