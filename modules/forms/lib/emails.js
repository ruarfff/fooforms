/*jslint node: true*/

var log = require('fooforms-logging').LOG;
var emailer = require('../../email');
var fs = require('fs');
var path = require('path');
var templateDir = path.join(__dirname, '../../email/templates');
var _ = require('lodash');


// Newline to <br>
function nl2br(str, is_xhtml) {

    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>';

    return (str + '')
        .replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

exports.sendUpdatePostNotification = function (from,distributionList,post) {
    log.info('sending post Update Notification email');


    var htmlTemplate = path.join(templateDir, 'updatePostNotification.html');
    var txtTemplate =  path.join(templateDir, 'updatePostNotification.txt');

    var env = process.env.NODE_ENV;
    var url;
    if (env === 'production') {
        url = 'https://fooforms.com';
    } else if (env === 'staging') {
        url = 'http://fooforms.jit.su';
    } else {
        url = 'http://localhost:3000';
    }

    var content="";

    var titles = _.where(post.fields, {'useAsTitle': true});


    var fields = _.map(
        _.where(post.fields, {'useAsTitle': true}),
        function(field) {
            return { label: field.label, value: field.value };
        }
    );



    var fieldCount = fields.length;

    for (var i=0;i<fieldCount;i++){
        if (typeof(fields[i].value)=='object'){
            content+= "<tr><th>" + fields[i].label +"</th><td>" + fields[i].displayName + "</td></tr>";
        }else{
            content+= "<tr><th>" + fields[i].label +"</th><td>" + fields[i].value + "</td></tr>";

        }
    }



    var htmlContent = fs.readFileSync(htmlTemplate).toString();
    htmlContent = htmlContent.replace('<% DISPLAYNAME %>', from.displayName);
    htmlContent = htmlContent.replace('<% CONTENT %>', content);

    var textContent = fs.readFileSync(txtTemplate).toString();
    textContent = textContent.replace('<% DISPLAYNAME %>', from.displayName);
    textContent = textContent.replace('<% CONTENT %>', content);


    var recipientCount = distributionList.length;
    for (var i = 0; i < recipientCount; i++) {
        var to = distributionList[i];
        var mailOptions = {
            from: "FOOFORMS <notify@fooforms.com>",
            to: to,
            replyTo: from.email,
            subject: from.displayName + " updated a post on Fooforms",
            text: textContent,
            html: htmlContent
        };
        // send mail with defined transport object
        emailer.send(mailOptions, function (error, response) {
            if (error) {
                log.error(error);
            } else {
                log.info("Message sent: " + response.response);
                log.info(response);
             }

        });

    }
};

exports.sendEventEmail = function (from, to, msgTitle, msgContent) {
    log.info('Sending Event Notification email');


    var htmlTemplate = path.join(templateDir, 'genericEmail.html');
    var txtTemplate = path.join(templateDir, 'genericEmail.txt');

    var textContent = fs.readFileSync(txtTemplate).toString();
    textContent = textContent.replace('<% CONTENT %>', msgContent);

    var htmlContent = fs.readFileSync(htmlTemplate).toString();
    htmlContent = htmlContent.replace('<% CONTENT %>', nl2br(msgContent));


    var mailOptions = {
        from: "FOOFORMS <notify@fooforms.com>",
        to: to,
        replyTo: from,
        subject: msgTitle,
        text: textContent,
        html: htmlContent
    };
    // send mail with defined transport object
    emailer.send(mailOptions, function (error, response) {
        if (error) {
            log.error(error);
        } else {
            log.info("Message sent: " + response.response);
            log.info(response);
        }

    });

};
