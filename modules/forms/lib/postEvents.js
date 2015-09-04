/*jslint node: true */
'use strict';


var FooForm = require('fooforms-forms');
var db = require('mongoose').connection;
var statusCodes = require('fooforms-rest').statusCodes;
var fooForm = new FooForm(db);
var _ = require('lodash');
var slug = require('slug');
var log = require('fooforms-logging').LOG;
var emailer = require('../lib/emails');

var Membership = require('fooforms-membership');
var membership = new Membership(db);


// Newline to <br>
function nl2br(str, is_xhtml) {

    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>';

    return (str + '')
        .replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var getFieldValue = function (fieldName, postJson) {
    var fieldValue = fieldName;
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
var getStatusFieldValue = function (fieldId, post) {
    var fieldValue = '';
    post.fields.forEach(function (field) {
        if (field.id == fieldId) {
            fieldValue = field.selected;
        }
    });

    return fieldValue;
};

var getFieldValueFromId = function (fieldId, post) {
    var fieldValue = '';
    post.fields.forEach(function (field) {
        if (field.id == fieldId) {
            if (field.hasOwnProperty('selected')) {
                fieldValue = field.selected;
            }
            if (field.hasOwnProperty('value')) {
                fieldValue = field.value;
            }
        }
    });

    return fieldValue;
};

var insertFieldValues = function (content, newPost) {
    while (content.indexOf("fooField-embed ") >= 0) {
        var fieldValue = '';
        var startPos = content.indexOf('<label class="fooField-embed');
        var endPos = content.indexOf("</label>");
        var placeHolder = content.substring(startPos, endPos + 8);
        var fieldIdStart = placeHolder.indexOf('id=');
        var fieldID = placeHolder.substring(fieldIdStart + 4, fieldIdStart + 17);

        if (isNumber(fieldID)) {
            fieldValue = getFieldValueFromId(fieldID, newPost);
            content = content.replace(placeHolder, fieldValue);
        } else {
            content = content.replace(placeHolder, '!**[Error In Field Placeholder]**!');
        }
    }
    return content;
};


var getTeamMembers = function (post, next) {
    var distributionList = [];

    membership.searchTeams({"folders": post.folder}, function (err, team) {
        if (err) {
            next(err);
        }
        if (team.success) {

            var users = team.data[0].members;


            if (users && users.length > 0) {
                users.forEach(function (user) {
                    distributionList.push(user.email);
                });
            }

        } else {
            log.error(__filename, ' - ', 'Team Not Found');
        }
        return next(err, distributionList);
    });


    /*    membership.Team.searchTeams({folders: post.folder}).populate('members').exec(function (err, team) {
     distributionList=[];
     if (err) return next(err);
     if (!team) {
     //res.status(statusCodes.NOT_FOUND).end();
     } else {
     var users = _.reject(team.members, function (user) {
     return user.displayName===updatedBy.displayName;
     });

     var distributionList = [];

     if (users && users.length > 0) {
     users.forEach(function (user) {
     distributionList.push(user.email);
     });
     }

     return distributionList;
     }
     });*/

};

var sendEmails = function (from, recipients, subject, text) {

    recipients.forEach(function (to) {
        // emailer.sendEventEmail(from, to, subject, text);
        log.debug(__filename, ' - ', 'EMail: From:' + from + ' To: ' + to + ' Subject: ' + subject + ' Text: ' + text);

    });
};

exports.doPostEvents = function (form, oldPost, newPost, isNewPost) {
    try {
// Get the current Saved form
// As the post may not contain the full or latest trigger / events details
        form.formEvents.forEach(function (formEvent) {
            //Test if the event should be processed
            var processEvent = false;
            switch (formEvent.type) {
                case "statusChange":

                    if (getStatusFieldValue(formEvent.actionData.statusField, newPost) === formEvent.actionData.statusValue) {
                        if (oldPost && getStatusFieldValue(formEvent.actionData.statusField, oldPost) === formEvent.actionData.statusValue) {
                            // Status was previously set to target value so no need to fire event.
                            processEvent = false;
                        } else {
                            processEvent = true;
                        }
                    }
                    break;

                case "newPost" :
                    if (isNewPost) {
                        processEvent = true;
                    }

                    break;

                case "updatePost" :
                    if (!isNewPost) {
                        processEvent = true;
                    }

                    break;

            }
            if (processEvent) {
                //Procees The event
                switch (formEvent.action) {

                    case  "Email":
                        var from = formEvent.actionData.emailFrom;
                        var subject = formEvent.actionData.emailTitle;
                        var text = insertFieldValues(formEvent.actionData.emailContent, newPost);

                        var recipients = [];
                        if (formEvent.actionData.emailToFormId == 'SpecifiedEmail') {
                            recipients.push(formEvent.actionData.emailTo);
                            sendEmails(from, recipients, subject, text);
                        } else if (formEvent.actionData.emailToFormId == 'Team') {
                            getTeamMembers(form, function (err, recipients) {
                                sendEmails(from, recipients, subject, text);
                            });
                        } else {
                            recipients.push(getFieldValueFromId(formEvent.actionData.emailToFormId, newPost));
                            sendEmails(from, recipients, subject, text);
                        }


                        break;

                    case "API":
                        // Do some funky Rest API stuff to some far flung server

                        break;


                }
            }


        });


    } catch (err) {
        log.error(__filename, ' - ', err);

    }

};
