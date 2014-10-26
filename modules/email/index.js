/*jslint node: true */
'use strict';
var log = require('fooforms-logging').LOG;
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


var transport = nodemailer.createTransport(smtpTransport({
    host: 'hydrogen.portfast.net',
    port: 25,
    auth: {
        user: 'ruairi@fooforms.com',
        pass: 'Aegis544789'
    }
}));


// setup e-mail data with unicode symbols
var mailOptions = {
    from: "Hello Foo <foo@fooforms.com>", // sender address
    to: "ruairitobrien@gmail.com", // list of receivers
    subject: "Hello", // Subject line
    text: "Hello world", // plaintext body
    html: "<b>Hello world ✔</b>" // html body
};


exports.sendHelloWorld = function (next) {
    log.info('sending email');
    // send mail with defined transport object
    transport.sendMail(mailOptions, function (error, response) {
        if (error) {
            log.error(error);
        } else {
            log.error("Message sent: " + response.message);
        }

        transport.close(); // shut down the connection pool, no more messages

        next(error, response);
    });
};
