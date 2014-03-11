/*jslint node: true */

var Cloud = require('../models/cloud').Cloud;
var log = require(global.config.apps.LOGGING).LOG;

/**
 * Add a user to the Cloud members list
 *
 * @param cloudId - The objectId of the cloud that will have the member added to it
 * @param userId - The objectId of the user to be added to the clouds members list
 * @param next - Callback. Gets passed err and cloud
 * @returns {*}
 */
exports.addCloudMember = function (cloudId, userId, next) {
    try {
        return next(new Error('Not implemented'));
    } catch (err) {
        return next(err);
    }
};

/**
 * Grant a user write permissions for a cloud. If the user is not already a member, they will be added to
 * the members list.
 *
 * @param cloudId - The objectId of the cloud that will have the member added to it
 * @param userId - The objectId of the user to be added to the clouds members list
 * @param next - Callback. Gets passed err and cloud
 * @returns {*}
 */
exports.addCloudMemberWithWritePermissions = function (cloudId, userId, next) {
    try {
        return next(new Error('Not implemented'));
    } catch (err) {
        return next(err);
    }
};

/**
 * Remove a user from the cloud members list.
 * If the user is in the write permissions list they will be removed from
 * that also.
 *
 * @param cloudId - The objectId of the cloud that will have the member added to it
 * @param userId - The objectId of the user to be added to the clouds members list
 * @param next - Callback. Gets passed err and cloud
 * @returns {*}
 */
exports.removeCloudMember = function (cloudId, userId, next) {
    try {
        return next(new Error('Not implemented'));
    } catch (err) {
        return next(err);
    }
};

/**
 * Remove a user form a clouds write permissions list but keep them in the members list.
 *
 * @param cloudId - The objectId of the cloud that will have the member added to it
 * @param userId - The objectId of the user to be added to the clouds members list
 * @param next - Callback. Gets passed err and cloud
 * @returns {*}
 */
exports.removeCloudMemberWritePermissions = function (cloudId, userId, next) {
    try {
        return next(new Error('Not implemented'));
    } catch (err) {
        return next(err);
    }
};