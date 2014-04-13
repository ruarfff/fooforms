/*jslint node: true */
'use strict';

var path = require('path');

var viewDir = path.join(global.config.modules.FORMVIEWER, 'views');
var authenticator = require(global.config.modules.AUTHENTICATION);
var apiUtil = require(global.config.modules.APIUTIL);
var log = require(global.config.modules.LOGGING).LOG;


var routes = function (app, passport) {

    /*********************************************************************************
     *  View Handling
     *********************************************************************************/


    app.get('/partials/formViewer', authenticator.ensureLoggedIn, function (req, res) {
        res.render(viewDir + '/index');
    });

    /*********************************************************************************
     *  Embedded Form Retrieval
     *********************************************************************************/

    app.post('/forms/repo/post', function (req, res) {
        try {
            require(global.config.modules.FORM + '/api/postApi').create(req, res);
        } catch (err) {
            apiUtil.handleError(res, err);
        }
    });

    app.get('/forms/repo/:form', function (req, res) {
        require(global.config.modules.FORM).getFormById(req.params.form, function (err, form) {
            if (err) {
                res.send(500);
            }
            if (!form) {
                res.send(404);
            }
            res.render(viewDir + '/embeddedForm', {
                formId: form._id,
                formName: form.name
            });
        });
    });

    app.get('/forms/repo/fetch/:form', function (req, res) {
        require(global.config.modules.FORM + '/api/formApi').getFormById(req.params.form, res);
    });

};


module.exports = routes;
