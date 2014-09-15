/*jslint node: true */
'use strict';
var formLib = require(global.config.modules.FORM);
var errorResponseHandler = require('fooforms-rest').errorResponseHandler;
var log = require('fooforms-logging').LOG;


/**
 *
 * @param req
 * @param res
 */
var createComment = function (req, res) {
    try {
        var body = req.body;

        var commentDetails = {
            content: body.content,
            post: body.post,
            commenter: req.user
        };

        formLib.createComment(commentDetails, function (err, comment) {
            if(err) {
                errorResponseHandler.handleError(res, err);
            } else {

                formLib.Comment
                    .findById(comment._id)
                    .populate('commenter')
                    .exec(function (err, comment) {
                        if(err) {
                            errorResponseHandler.handleError(res, err);
                        } else {
                            res.status(200);
                            res.send(comment);
                        }
                    });
            }
        });
    } catch (err) {
        errorResponseHandler.handleError(res, err);
    }
};

module.exports = {
    create: createComment
};





