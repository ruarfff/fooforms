/*jslint node: true */
"use strict";

var Form = require(global.config.modules.FORM).Form;
var User = require(global.config.modules.USER).User;
var Folder = require('../models/folder').Folder;
var log = require(global.config.modules.LOGGING).LOG;
var folderMembers = require('./folderMembers');
var folderErrors = require('./folderErrors');

/**
 * Only allows updating of basic Folder data.
 * Does not update owner, members or forms.
 *
 * @param folderJson
 * @param next
 */
var updateFolder = function (folderJson, next) {
    try {
        Folder.findByIdAndUpdate(folderJson._id, {
            name: folderJson.name,
            description: folderJson.description,
            icon: folderJson.icon,
            menuLabel: folderJson.menuLabel
        }, { multi: false }, function (err, folder) {
            if(!folder && !err) {
                err = folderErrors.folderNotFoundError;
            }
            next(err, folder);
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

/**
 * Passes a folder to the callback.
 * If the form is already published the folder will be the one it is already published too.
 * If the form has not been published the folder will be empty.
 *
 * @param formId
 * @param userId
 * @param next
 */
var checkIfFormAlreadyPublished = function (formId, userId, next) {
    try {
        User.findById(userId).populate('folderMemberships').exec( function (err, user) {
            if (err) {
                return (next(err));
            }
            if (!user) {
                return (next(folderErrors.userNotFoundError));
            }
            var folderQuery = require('./folderQuery');
            folderQuery.getUserFolders(user._id, function (err, folders) {
                if (err) {
                    return (next(err));
                }
                var folderCount = 0;
                var i;
                if (folders) {
                    folderCount = folders.length;
                    for (i = 0; i < folderCount; i++) {
                        if (folders[i].forms) {
                            if (folders[i].forms.indexOf(formId) > -1) {
                                return next(err, folders[i]);
                            }
                        }
                    }
                }
                if (user.folderMemberships) {
                    folderCount = user.folderMemberships.length;
                    for (i = 0; i < folderCount; i++) {
                        if (user.folderMemberships[i].forms) {
                            if (user.folderMemberships[i].forms.indexOf(formId) > -1) {
                                return next(err, user.folderMemberships[i]);
                            }
                        }
                    }
                }
                return next(err, false);
            });
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};


/**
 * Add a single form to a Folder. Will not allow
 * addition of Form owned by a User without permissions.
 *
 * @param folderId
 * @param formId
 * @param next
 */
var addFormToFolder = function (folderId, formId, next) {
    try {
        Folder.findById(folderId, function (err, folder) {
            if (!err && !folder) {
                err = folderErrors.folderNotFoundError;
            }
            if (err) {
                log.error(__filename, ' - ', err);
                return next(err);
            }

            Form.findById(formId).populate('owner').exec(function (err, form) {
                if(!err && !form) {
                    err = folderErrors.formNotFoundError;
                }
                if (err) {
                    log.error(__filename, ' - ', err);
                    return next(err);
                }

                if (folderMembers.userHasWritePermissionInFolder(folder, form.owner)) {
                    if (!folder.forms) {
                        folder.forms = [];
                    }
                    checkIfFormAlreadyPublished(form._id, form.owner._id, function (err, folderFormPublishedTo) {
                        if (err) {
                            return next(err);
                        }
                        if (folderFormPublishedTo) {
                            return next(folderErrors.formAlreadyPublishedError, folder);
                        }
                        folder.forms.push(form._id);
                        folder.save(next);
                    });
                } else {
                    return next(folderErrors.userNotAuthorisedToPublishError, folder);
                }
            });

        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

/**
 * Delete an form from a folder if it exists.
 *
 * @param folderId
 * @param formId
 * @param next
 */
var removeFormFromFolder = function (folderId, formId, next) {
    try {
        Folder.findById(folderId, function (err, folder) {
            if (!err && !folder) {
                err = folderErrors.folderNotFoundError;
            }
            if (err) {
                log.error(__filename, ' - ', err);
                return next(err);
            }
            if (folder.forms) {
                var index = folder.forms.indexOf(formId);
                if (index > -1) {
                    folder.forms.pull(formId);
                    folder.save(next);
                } else {
                    return next(folderErrors.formNotInFolderError, folder);
                }
            } else {
                return next(folderErrors.folderHasNoFormsError, folder);
            }

        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

/**
 * This will remove an form from its current folder and add it the the folder
 * specified with the folderId parameter
 *
 * @param folderId
 * @param formId
 * @param next
 */
var moveFormFromOneFolderToAnother = function(folderId, formId, next) {
    try {
        Form.findById(formId).populate('owner').exec(function (err, form) {
            if (!err && !form) {
                err = folderErrors.formNotFoundError;
            }
            if (err) {
                log.error(__filename, ' - ', err);
                return next(err);
            }
            checkIfFormAlreadyPublished(form._id, form.owner._id, function (err, folderFormPublishedTo) {
                if(!err && !folderFormPublishedTo) {
                    err = folderErrors.formNotInFolderError;
                }
                if (err) {
                    log.error(__filename, ' - ', err);
                    return next(err);
                }
                Folder.findById(folderId, function (err, folderToMoveFormTo) {
                    if(!err && !folderToMoveFormTo) {
                        err = folderErrors.folderNotFoundError;
                    }
                    if (err) {
                        log.error(__filename, ' - ', err);
                        return next(err);
                    }
                   if(!folderMembers.userHasWritePermissionInFolder(folderToMoveFormTo, form.owner)) {
                       return next(folderErrors.userNotAuthorisedToPublishError);
                   }
                    removeFormFromFolder(folderFormPublishedTo._id, form._id, function (err, folder) {
                        if(!err && !folder) {
                            err = folderErrors.formNotInFolderError;
                        }
                        if (err) {
                            log.error(__filename, ' - ', err);
                            return next(err);
                        }
                        addFormToFolder(folderToMoveFormTo._id, form._id, next);
                    });
                });
            });
        });
    } catch (err) {
        log(err);
        return next(err);
    }
};

/**
 * This will create a new form document with all the same values as the form
 * referenced by the formId parameter. A new ID will be assigned to the copied form
 * and it will not contain any of the posts that were present in the original form
 *
 * @param folderId
 * @param formId
 * @param next
 */
var copyFormToFolder = function(folderId, formId, next) {
    try {
        Form.findById(formId).populate('owner').exec(function (err, form) {
            if (!err && !form) {
                err = folderErrors.formNotFoundError;
            }
            if (err) {
                log.error(__filename, ' - ', err);
                return next(err);
            }
            checkIfFormAlreadyPublished(form._id, form.owner._id, function (err, folderFormPublishedTo) {
                if(!err && !folderFormPublishedTo) {
                    err = folderErrors.formNotInFolderError;
                }
                if (err) {
                    log.error(__filename, ' - ', err);
                    return next(err);
                }
                Folder.findById(folderId, function (err, folderToCopyFormTo) {
                    if(!err && !folderToCopyFormTo) {
                        err = folderErrors.folderNotFoundError;
                    }
                    if (err) {
                        log.error(__filename, ' - ', err);
                        return next(err);
                    }
                    if(!folderMembers.userHasWritePermissionInFolder(folderToCopyFormTo, form.owner)) {
                        return next(folderErrors.userNotAuthorisedToPublishError);
                    }
                    var formCopy = {
                        name: form.name,
                        description: form.description || '',
                        icon: form.icon || '',
                        menuLabel: form.menuLabel || '',
                        owner: form.owner,
                        folder: folderToCopyFormTo._id,
                        btnLabel: form.btnLabel || '',
                        settings: form.settings || {},
                        fields: form.fields || [],
                        formEvents: [],
                        sharing: {},
                        privileges: String

                    };
                    require(global.config.modules.FORM).createForm(formCopy, function (err, form) {
                        if(!err && !form) {
                            err = folderErrors.formNotFoundError;
                        }
                        if (err) {
                            log.error(__filename, ' - ', err);
                            return next(err);
                        }
                        addFormToFolder(folderToCopyFormTo._id, form._id, next);
                    });
                });
            });
        });
    } catch (err) {
        log(err);
        return next(err);
    }
};

/**
 * Get all forms belonging to a folder
 *
 * @param folderId
 * @param next
 */
var getFolderForms = function (folderId, next) {
    try {
        Folder.findById(folderId).populate('forms').exec(function (err, folder) {
            if(!err && !folder) {
                return next(folderErrors.folderNotFoundError);
            }
            if(folder) {
                return next(err, folder.forms);
            } else {
                return next(err);
            }
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        return next(err);
    }
};

/**
 * Get just the form names that were published to a folder
 *
 * @param folderId
 * @param next
 */
var getFolderFormNames = function (folderId, next) {
    try {
        Folder.findById(folderId).populate('forms', 'name').exec(function (err, folder) {
            if(!err && !folder) {
                return next(folderErrors.folderNotFoundError);
            }
            var names = [];
            var i = 0;
            var count = (folder.forms && folder.forms.length) ? folder.forms.length : 0;
            for (i; i < count; i++) {
                names.push(folder.forms[i].name);
            }
            next(err, names);
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

module.exports = {
    updateFolder: updateFolder,
    addFormToFolder: addFormToFolder,
    removeFormFromFolder: removeFormFromFolder,
    getFolderForms: getFolderForms,
    getFolderFormNames: getFolderFormNames,
    moveFormFromOneFolderToAnother: moveFormFromOneFolderToAnother,
    copyFormToFolder: copyFormToFolder
};