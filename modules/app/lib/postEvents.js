/*jslint node: true */

var Post = require('../models/post').Post;
var appErrors = require('./appErrors');
var log = require(global.config.apps.LOGGING).LOG;

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
        log.error(err.toString());
        next(err)
    }
}

var getFieldValue = function (fieldName, postJson) {
    var fieldValue = null;
    if (fieldName.indexOf("[[") >= 0) {

        var emailToField = fieldName.replace("[[", "");
        emailToField = emailToField.replace("]]", "");

        for (var i in postJson.fields) {

            var field = postJson.fields[i];

            if (field.label == emailToField) {
                fieldValue = field.value;
            }

        }

    }
    return fieldValue;


}


exports.doPostEvents = function (trigger, postJson, next) {
    "use strict";
    try {

        for (var i in postJson.formEvents) {

            var formEvent = postJson.formEvents[i];
            if (formEvent.type == trigger) {
                var processEvent = false;
                switch (trigger) {
                    case "statusChange":

                        if (getFieldValue(formEvent.actionData.statusField) == getFieldValue(formEvent.actionData.statusValue)) {
                            processEvent = true;
                        }
                        break;

                    case "newPost" :
                        processEvent = true;
                        break

                }
                switch (formEvent.action) {

                    case  "Email":
                        var from = formEvent.actionData.emailFrom;
                        var to = getFieldValue(formEvent.actionData.emailTo, postJson);
                        var subject = formEvent.actionData.emailTitle;
                        var text = formEvent.actionData.emailContent;
                        log.debug('EMail: From:' + from + ' To: ' + to + ' Subject: ' + subject + ' Text: ' + text);

                        sendMail(from, to, subject, text, function (err) {
                                if (err) {
                                    log.error(err.toString());
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
        }

        next(null);
    } catch (err) {
        log.error(err.toString());
        next(err);
    }

};