/*jslint node: true*/

var log = require('fooforms-logging').LOG;
var emailer = require('../../email');


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
        rootUrl = 'http://fooforms.com';
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
        '<p><a href="' + url + '">Click here</a> to be brought to FOOFORMS and become part of '+ organisationName +'</p>'
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