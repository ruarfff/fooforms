/*jslint node: true */
'use strict';
var formLib = require(global.config.modules.FORM);
var apiUtil = require(global.config.modules.APIUTIL);
var log = require(global.config.modules.LOGGING).LOG;


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
                apiUtil.handleError(res, err);
            } else {

                formLib.Comment
                    .findById(comment._id)
                    .populate('commenter')
                    .exec(function (err, comment) {
                        if(err) {
                            apiUtil.handleError(res, err);
                        } else {
                            res.status(200);
                            res.send(comment);
                        }
                    });
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

module.exports = {
    create: createComment
};





