/*jslint node: true */
'use strict';
var log = require('fooforms-logging').LOG;
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


var transport = nodemailer.createTransport(smtpTransport({
    host: 'hydrogen.portfast.net',
    port: 25,
    auth: {
        user: 'hello@fooforms.com',
        pass: 'G0Fly09123*'
    }
}));

exports.send = function (args, next) {
  return transport.sendMail(args, function (err, response) {
      transport.close(); // shut down the connection pool, no more messages
      next(err, response);
  });
};