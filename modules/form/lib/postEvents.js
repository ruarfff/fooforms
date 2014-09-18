/*jslint node: true */
'use strict';

var Post = require('../models/post').Post;
var formErrors = require('./formErrors');
var log = require('fooforms-logging').LOG;

var mail = require("nodemailer").mail;

// Newline to <br>
function nl2br(str, is_xhtml) {

    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display

    return (str + '')
        .replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

var sendMail = function (from, to, subject, content, next) {
    try {
        mail({
            from: "Auto Notification <notifier@fooforms.com>",
            "reply_to": from, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: content, // plaintext body
            html: nl2br(content, true) // html body
        });
        next(null);
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

var getFieldValue = function (fieldName, postJson) {
    var fieldValue = null;
    if (fieldName.indexOf("[[") >= 0) {

        var emailToField = fieldName.replace("[[", "");
        emailToField = emailToField.replace("]]", "");

        postJson.fields.forEach(function (field) {
            if (field.label === emailToField) {
                fieldValue = field.value;
            }
        });
    }
    return fieldValue;
};


exports.doPostEvents = function (trigger, postJson, next) {
    try {
if (postJson.hasOwnProperty('formEvents')) {
    postJson.formEvents.forEach(function (formEvent) {
        if (formEvent.type === trigger) {
            var processEvent = false;
            switch (trigger) {
                case "statusChange":

                    if (getFieldValue(formEvent.actionData.statusField) === getFieldValue(formEvent.actionData.statusValue)) {
                        processEvent = true;
                    }
                    break;

                case "newPost" :
                    processEvent = true;
                    break;

            }
            switch (formEvent.action) {

                case  "Email":
                    var from = formEvent.actionData.emailFrom;
                    var to = getFieldValue(formEvent.actionData.emailTo, postJson);
                    var subject = formEvent.actionData.emailTitle;
                    var text = formEvent.actionData.emailContent;
                    log.debug(__filename, ' - ', 'EMail: From:' + from + ' To: ' + to + ' Subject: ' + subject + ' Text: ' + text);

                    sendMail(from, to, subject, text, function (err) {
                        if (err) {
                            log.error(__filename, ' - ', err);
                        }
                    });


                    break;

                case "API":
                    // Do some funky Rest API stuff to some far flung server

                    break;

                case "Launch":

                // Launch Inter-continental Ballistic Missiles!!


            }
        }
    });

    next();
}else{
    next();
}
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }

};
