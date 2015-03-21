/*jslint node: true*/

var log = require('fooforms-logging').LOG;
var emailer = require('../../email');
var fs = require('fs');
var path = require('path');
var templateDir = path.join(__dirname, '../../email/templates');


exports.sendHelloWorld = function (next) {
    log.info('sending email');
    var mailOptions = {
        from: "Hello Foo <hello@fooforms.com>", // sender address
        to: "test@fooforms.com", // list of receivers
        subject: "Hello", // Subject line
        text: "Hello world", // plaintext body
        html: "<b>Hello world ✔</b>" // html body
    };
    // send mail with defined transport object
    emailer.send(mailOptions, function (err, res) {
        if (err) {
            log.error(err);
        } else {
            log.info("Message sent: " + res.response);
        }

        next(err, res);
    });
};

exports.sendInvitation = function (invite, next) {
    log.info('sending invite');
    var env = process.env.NODE_ENV;
    var rootUrl;
    if (env === 'production') {
        rootUrl = 'https://fooforms.com';
    } else if (env === 'staging') {
        rootUrl = 'http://fooforms.jit.su';
    } else {
        rootUrl = 'http://localhost:3000';
    }

    var url = rootUrl + '/invite/' + invite._id;

    var organisationName = invite.organisation.displayName;
    var inviterName = invite.inviter.displayName;
    var to = invite.email;
    var message = invite.message;


    var mailOptions = {
        from: "Hello Foo <hello@fooforms.com>",
        to: to,
        subject: "Invitation from " + inviterName + " to join " + organisationName,
        text: url,
        html: '<p>Hi, you have been invited to join the organisation called ' + organisationName + ' on FOOFORMS</p>' +
        '<p><a href="' + url + '">Accept Invitation</a></p>' +
        '<h4>Message from sender</h4>' +
        '<p>' + message + '</p>' +
        '<p><a href="' + url + '">Click here</a> to be brought to FOOFORMS and become part of ' + organisationName + '</p>'
    };
    // send mail with defined transport object
    emailer.send(mailOptions, function (error, response) {
        if (error) {
            log.error(error);
            invite.status = 'failed';
        } else {
            log.info("Message sent: " + response.response);
            log.info(response);
            invite.status = 'sent';
        }

        next(error, invite);
    });
};

exports.sendWelcomeEmail = function (welcome) {
    log.info('sending welcome email');


    var htmlTemplate = path.join(templateDir, 'welcome.html');
    var txtTemplate = path.join(templateDir, 'welcome.txt');

    var env = process.env.NODE_ENV;
    var url;
    if (env === 'production') {
        url = 'https://fooforms.com';
    } else if (env === 'staging') {
        url = 'http://fooforms.jit.su';
    } else {
        url = 'http://localhost:3000';
    }

    var organisationName = welcome.organisation.displayName;
    var to = welcome.user.email;


    var htmlContent = fs.readFileSync(htmlTemplate).toString();
    htmlContent = htmlContent.replace('<% ORGANISATION %>', organisationName);
    htmlContent = htmlContent.replace('<% FIRSTNAME %>', welcome.user.displayName);

    var textContent = fs.readFileSync(txtTemplate).toString();
    textContent = textContent.replace('<% ORGANISATION >%', organisationName);
    textContent = textContent.replace('<% FIRSTNAME %>', welcome.user.displayName);


    var mailOptions = {
        from: "FOOFORMS <brian@fooforms.com>",
        to: to,
        subject: organisationName + " on Fooforms",
        text: textContent,
        html: htmlContent
    };
    // send mail with defined transport object
    emailer.send(mailOptions, function (error, response) {
        if (error) {
            log.error(error);
            welcome.status = 'failed';
        } else {
            log.info("Message sent: " + response.response);
            log.info(response);
            welcome.status = 'sent';
        }

    });
};

exports.sendForgottenPasswordEmail = function (args, next) {
    var mailOptions = {
        from: "Hello Foo <hello@fooforms.com>",
        to: args.email,
        subject: 'Fooforms Password Reset',
        text: args.url,
        html: '<p>Hi, You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>' +
        '<p>Please click on the following link:</p>' +
        '<p><a href="' + args.url + '">Reset Password</a></p>' +
        '<p>or paste this into your browser to complete the process:</p>' +
        '<p>' + args.url + '</p>' +
        '<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>'
    };
    // send mail with defined transport object
    emailer.send(mailOptions, function (error, response) {
        if (error) log.error(error);
        next(error, response);
    });
};

exports.sendUpdatedPasswordEmail = function (args, next) {
    var user = args.user;

    var mailOptions = {
        to: user.email,
        from: "Hello Foo <hello@fooforms.com>",
        subject: 'Your Fooforms password has been changed',
        text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n',
        html: '<p>Hello,</p>' +
        '<p>This is a confirmation that the password for your account ' + user.email + ' has just been changed</p>' +
        '<p>If you did not initiate this password update request please contact us at:</p>' +
        '<p><a href="mailto:support@fooforms.com?subject=Suspicious Password Change for account: ' + user.email + '">support@fooforms.com</a> </p>' +
        '<p>Kind Regards,</p>' +
        '<p><The Fooforms Team</p>'
    };
    emailer.send(mailOptions, function (err, response) {
        if (err) log.error(err);
        next(err, response);
    });
};