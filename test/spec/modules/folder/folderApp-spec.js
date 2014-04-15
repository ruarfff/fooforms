/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var folderSpecUtil = require('./folder-spec-util');
var log = require(global.config.modules.LOGGING).LOG;

describe('Publishing, Updating and Removing Forms in Folders', function () {
    var folderLib;
    var folderErrors;

    before(function () {
        folderLib = require(global.config.modules.FOLDER);
        folderErrors = folderLib.folderErrors;
    });

    beforeEach(function (done) {
        folderSpecUtil.seedFoldersInDatabase(done);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });

    describe('Publishing Form to User Folder', function () {
        it('should update the form list with the new form if form owner is folder owner', function (done) {
            folderLib.addFormToFolder(folderSpecUtil.getFolder1Id(), folderSpecUtil.getForm1Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);

                folder._id.should.eql(folderSpecUtil.getFolder1Id());
                folder.owner.should.eql(folderSpecUtil.getUser1Id());

                folder.should.have.property('forms').with.lengthOf(1);
                folder.forms[0].should.eql(folderSpecUtil.getForm1Id());

                done();
            });
        });
        it('should update the form list with the new form if form owner is not folder owner but is in the writeable members list', function (done) {
            folderLib.addFolderMemberWithWritePermissions(folderSpecUtil.getFolder1Id(), folderSpecUtil.getUser2Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);
                folder._id.should.eql(folderSpecUtil.getFolder1Id());
                folder.owner.should.eql(folderSpecUtil.getUser1Id());
                folder.should.have.property('membersWithWritePermissions').with.lengthOf(1);
                folder.membersWithWritePermissions[0].should.eql(folderSpecUtil.getUser2Id());

                folderLib.addFormToFolder(folder._id, folderSpecUtil.getForm2Id(), function (err, folder) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(folder);

                    folder.should.have.property('forms').with.lengthOf(1);
                    folder.forms[0].should.eql(folderSpecUtil.getForm2Id());

                    done();
                });
            });
        });
        it('should Not update the form list with the new form if form owner is Not folder owner and Not in the writeable members list', function (done) {
            folderLib.addFormToFolder(folderSpecUtil.getFolder1Id(), folderSpecUtil.getForm2Id(), function (err, folder) {
                should.exist(err);
                if (folder.forms) {
                    should(folder.forms.indexOf(folderSpecUtil) === -1).ok;
                }
                done();
            });
        });
        it('should not add an form to a Folder if the form is already in the Folder', function (done) {
            folderLib.addFormToFolder(folderSpecUtil.getFolder3Id(), folderSpecUtil.getForm3Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);
                folderLib.addFormToFolder(folderSpecUtil.getFolder3Id(), folderSpecUtil.getForm3Id(), function (err, folder) {
                    should.exist(err);
                    should.exist(folder);
                    folder.forms.length.should.equal(1);
                    done();
                });
            });
        });
        it('should not add an form to a Folder if the form is already in another Folder that the form Owner has write permissions for', function (done) {
            folderLib.addFolderMemberWithWritePermissions(folderSpecUtil.getFolder4Id(), folderSpecUtil.getUser3Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);
                folderLib.addFormToFolder(folderSpecUtil.getFolder3Id(), folderSpecUtil.getForm3Id(), function (err, folder) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(folder);
                    folder.forms.length.should.equal(1);
                    folderLib.addFormToFolder(folderSpecUtil.getFolder4Id(), folderSpecUtil.getForm3Id(), function (err, folder) {
                        should.exist(err);
                        should.exist(folder);
                        folder.forms.length.should.equal(0);
                        done();
                    });
                });
            });
        });
    });

    describe('Removing forms from Folder', function () {
        it('should remove a form from Folder', function (done) {
            folderLib.addFormToFolder(folderSpecUtil.getFolder1Id(), folderSpecUtil.getForm1Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);

                folder._id.should.eql(folderSpecUtil.getFolder1Id());
                folder.owner.should.eql(folderSpecUtil.getUser1Id());

                folder.should.have.property('forms').with.lengthOf(1);
                folder.forms[0].should.eql(folderSpecUtil.getForm1Id());

                folderLib.removeFormFromFolder(folderSpecUtil.getFolder1Id(), folderSpecUtil.getForm1Id(), function (err, folder) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(folder);
                    should(folder.forms.indexOf(folderSpecUtil.getForm1Id()) === -1).ok;
                    done();
                });
            });
        });
        it('should give an error if the form does not exist in the Folder', function (done) {
            folderLib.removeFormFromFolder(folderSpecUtil.getFolder1Id(), folderSpecUtil.getForm1Id(), function (err, folder) {
                should.exist(err);
                should.exist(folder);
                done();
            });
        });
        it('should move a form from one folder to another', function (done) {
            folderLib.addFolderMemberWithWritePermissions(folderSpecUtil.getFolder1Id(), folderSpecUtil.getUser2Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);

                folderLib.addFormToFolder(folder._id, folderSpecUtil.getForm2Id(), function (err, folder) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(folder);

                    folder.should.have.property('forms').with.lengthOf(1);
                    folder.forms[0].should.eql(folderSpecUtil.getForm2Id());
                    folderLib.moveFormFromOneFolderToAnother(folderSpecUtil.getFolder2Id(), folderSpecUtil.getForm2Id(), function(err, folder) {
                        if (err) {
                            return done(err);
                        }
                        should.exist(folder);
                        folder.should.have.property('forms').with.lengthOf(1);
                        folder.forms[0].should.eql(folderSpecUtil.getForm2Id());
                        folderLib.getFolderById(folderSpecUtil.getFolder1Id(), function(err, folder) {
                            if (err) {
                                return done(err);
                            }
                            should.exist(folder);
                            folder.should.have.property('forms').with.lengthOf(0);
                            done();
                        });
                    });
                });
            });
        });
        it('should not move a form from one folder to another if the user does not have permissions on the folder', function (done) {
            folderLib.addFolderMemberWithWritePermissions(folderSpecUtil.getFolder2Id(), folderSpecUtil.getUser3Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);

                folderLib.addFormToFolder(folder._id, folderSpecUtil.getForm3Id(), function (err, folder) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(folder);

                    folder.should.have.property('forms').with.lengthOf(1);
                    folder.forms[0].should.eql(folderSpecUtil.getForm3Id());
                    folderLib.moveFormFromOneFolderToAnother(folderSpecUtil.getFolder1Id(), folderSpecUtil.getForm3Id(), function(err, folderThatShouldNotExist) {
                        should.exist(err);
                        err.should.eql(folderErrors.userNotAuthorisedToPublishError);
                        should.not.exist(folderThatShouldNotExist);
                        folderLib.getFolderById(folder._id, function(err, folder) {
                            if (err) {
                                return done(err);
                            }
                            should.exist(folder);
                            folder.should.have.property('forms').with.lengthOf(1);
                            folder.forms[0].should.eql(folderSpecUtil.getForm3Id());
                            done();
                        });
                    });
                });
            });
        });
        it('should copy a form from one folder to another', function (done) {
            folderLib.addFolderMemberWithWritePermissions(folderSpecUtil.getFolder1Id(), folderSpecUtil.getUser2Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);

                folderLib.addFormToFolder(folder._id, folderSpecUtil.getForm2Id(), function (err, folder) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(folder);

                    folder.should.have.property('forms').with.lengthOf(1);
                    folder.forms[0].should.eql(folderSpecUtil.getForm2Id());
                    folderLib.copyFormToFolder(folderSpecUtil.getFolder2Id(), folderSpecUtil.getForm2Id(), function(err, folder) {
                        if (err) {
                            return done(err);
                        }
                        should.exist(folder);
                        folder.should.have.property('forms').with.lengthOf(1);
                        folderLib.getFolderById(folderSpecUtil.getFolder1Id(), function(err, folder) {
                            if (err) {
                                return done(err);
                            }
                            should.exist(folder);
                            folder.should.have.property('forms').with.lengthOf(1);
                            folder.forms[0].should.eql(folderSpecUtil.getForm2Id());
                            done();
                        });
                    });
                });
            });
        });
        it('should not copy an form from one folder to another if user is not authorised on folder', function (done) {
            folderLib.addFolderMemberWithWritePermissions(folderSpecUtil.getFolder1Id(), folderSpecUtil.getUser2Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);

                folderLib.addFormToFolder(folder._id, folderSpecUtil.getForm2Id(), function (err, folder) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(folder);

                    folder.should.have.property('forms').with.lengthOf(1);
                    folder.forms[0].should.eql(folderSpecUtil.getForm2Id());
                    folderLib.copyFormToFolder(folderSpecUtil.getFolder4Id(), folderSpecUtil.getForm2Id(), function(err, folder) {
                        should.exist(err);
                        should.not.exist(folder);
                        done();
                    });
                });
            });
        });
    });

    describe('Folder form retrieval', function () {
        it('should get all forms belonging to a folder', function (done) {
            folderLib.addFormToFolder(folderSpecUtil.getFolder2Id(), folderSpecUtil.getForm2Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);

                folder._id.should.eql(folderSpecUtil.getFolder2Id());
                folder.owner.should.eql(folderSpecUtil.getUser2Id());

                folder.should.have.property('forms').with.lengthOf(1);
                folder.forms[0].should.eql(folderSpecUtil.getForm2Id());

                folderLib.getFolderForms(folderSpecUtil.getFolder2Id(), function (err, forms) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(forms);
                    forms.length.should.equal(1);
                    forms[0]._id.should.eql(folderSpecUtil.getForm2Id());
                    forms[0].name.should.equal('form2');
                    done();
                });
            });
        });
        it('should get a list of form names belonging to a folder', function (done) {
            folderLib.addFolderMemberWithWritePermissions(folderSpecUtil.getFolder4Id(), folderSpecUtil.getUser2Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);
                folderLib.addFolderMemberWithWritePermissions(folderSpecUtil.getFolder4Id(), folderSpecUtil.getUser3Id(), function (err, folder) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(folder);
                    folderLib.addFormToFolder(folderSpecUtil.getFolder4Id(), folderSpecUtil.getForm2Id(), function (err, folder) {
                        if (err) {
                            return done(err);
                        }
                        should.exist(folder);
                        folderLib.addFormToFolder(folderSpecUtil.getFolder4Id(), folderSpecUtil.getForm3Id(), function (err, folder) {
                            if (err) {
                                return done(err);
                            }
                            should.exist(folder);
                            folderLib.addFormToFolder(folderSpecUtil.getFolder4Id(), folderSpecUtil.getForm4Id(), function (err, folder) {
                                if (err) {
                                    return done(err);
                                }
                                should.exist(folder);

                                folderLib.getFolderFormNames(folder._id, function (err, names) {
                                    if (err) {
                                        return done(err);
                                    }
                                    should.exist(names);
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });

});