/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var cloudSpecUtil = require('./cloud-spec-util');
var log = require(global.config.modules.LOGGING).LOG;

describe('Publishing, Updating and Removing Forms in Clouds', function () {
    var cloudLib;
    var cloudErrors;

    before(function () {
        cloudLib = require(global.config.modules.CLOUD);
        cloudErrors = cloudLib.cloudErrors;
    });

    beforeEach(function (done) {
        cloudSpecUtil.seedCloudsInDatabase(done);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });

    describe('Publishing Form to User Cloud', function () {
        it('should update the form list with the new form if form owner is cloud owner', function (done) {
            cloudLib.addFormToCloud(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getForm1Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);

                cloud._id.should.eql(cloudSpecUtil.getCloud1Id());
                cloud.owner.should.eql(cloudSpecUtil.getUser1Id());

                cloud.should.have.property('forms').with.lengthOf(1);
                cloud.forms[0].should.eql(cloudSpecUtil.getForm1Id());

                done();
            });
        });
        it('should update the form list with the new form if form owner is not cloud owner but is in the writeable members list', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getUser2Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                cloud._id.should.eql(cloudSpecUtil.getCloud1Id());
                cloud.owner.should.eql(cloudSpecUtil.getUser1Id());
                cloud.should.have.property('membersWithWritePermissions').with.lengthOf(1);
                cloud.membersWithWritePermissions[0].should.eql(cloudSpecUtil.getUser2Id());

                cloudLib.addFormToCloud(cloud._id, cloudSpecUtil.getForm2Id(), function (err, cloud) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(cloud);

                    cloud.should.have.property('forms').with.lengthOf(1);
                    cloud.forms[0].should.eql(cloudSpecUtil.getForm2Id());

                    done();
                });
            });
        });
        it('should Not update the form list with the new form if form owner is Not cloud owner and Not in the writeable members list', function (done) {
            cloudLib.addFormToCloud(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getForm2Id(), function (err, cloud) {
                should.exist(err);
                if (cloud.forms) {
                    should(cloud.forms.indexOf(cloudSpecUtil) === -1).ok;
                }
                done();
            });
        });
        it('should not add an form to a Cloud if the form is already in the Cloud', function (done) {
            cloudLib.addFormToCloud(cloudSpecUtil.getCloud3Id(), cloudSpecUtil.getForm3Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                cloudLib.addFormToCloud(cloudSpecUtil.getCloud3Id(), cloudSpecUtil.getForm3Id(), function (err, cloud) {
                    should.exist(err);
                    should.exist(cloud);
                    cloud.forms.length.should.equal(1);
                    done();
                });
            });
        });
        it('should not add an form to a Cloud if the form is already in another Cloud that the form Owner has write permissions for', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud4Id(), cloudSpecUtil.getUser3Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                cloudLib.addFormToCloud(cloudSpecUtil.getCloud3Id(), cloudSpecUtil.getForm3Id(), function (err, cloud) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(cloud);
                    cloud.forms.length.should.equal(1);
                    cloudLib.addFormToCloud(cloudSpecUtil.getCloud4Id(), cloudSpecUtil.getForm3Id(), function (err, cloud) {
                        should.exist(err);
                        should.exist(cloud);
                        cloud.forms.length.should.equal(0);
                        done();
                    });
                });
            });
        });
    });

    describe('Removing forms from Cloud', function () {
        it('should remove a form from Cloud', function (done) {
            cloudLib.addFormToCloud(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getForm1Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);

                cloud._id.should.eql(cloudSpecUtil.getCloud1Id());
                cloud.owner.should.eql(cloudSpecUtil.getUser1Id());

                cloud.should.have.property('forms').with.lengthOf(1);
                cloud.forms[0].should.eql(cloudSpecUtil.getForm1Id());

                cloudLib.removeFormFromCloud(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getForm1Id(), function (err, cloud) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(cloud);
                    should(cloud.forms.indexOf(cloudSpecUtil.getForm1Id()) === -1).ok;
                    done();
                });
            });
        });
        it('should give an error if the form does not exist in the Cloud', function (done) {
            cloudLib.removeFormFromCloud(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getForm1Id(), function (err, cloud) {
                should.exist(err);
                should.exist(cloud);
                done();
            });
        });
        it('should move a form from one cloud to another', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getUser2Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);

                cloudLib.addFormToCloud(cloud._id, cloudSpecUtil.getForm2Id(), function (err, cloud) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(cloud);

                    cloud.should.have.property('forms').with.lengthOf(1);
                    cloud.forms[0].should.eql(cloudSpecUtil.getForm2Id());
                    cloudLib.moveFormFromOneCloudToAnother(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getForm2Id(), function(err, cloud) {
                        if (err) {
                            return done(err);
                        }
                        should.exist(cloud);
                        cloud.should.have.property('forms').with.lengthOf(1);
                        cloud.forms[0].should.eql(cloudSpecUtil.getForm2Id());
                        cloudLib.getCloudById(cloudSpecUtil.getCloud1Id(), function(err, cloud) {
                            if (err) {
                                return done(err);
                            }
                            should.exist(cloud);
                            cloud.should.have.property('forms').with.lengthOf(0);
                            done();
                        });
                    });
                });
            });
        });
        it('should not move a form from one cloud to another if the user does not have permissions on the cloud', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getUser3Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);

                cloudLib.addFormToCloud(cloud._id, cloudSpecUtil.getForm3Id(), function (err, cloud) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(cloud);

                    cloud.should.have.property('forms').with.lengthOf(1);
                    cloud.forms[0].should.eql(cloudSpecUtil.getForm3Id());
                    cloudLib.moveFormFromOneCloudToAnother(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getForm3Id(), function(err, cloudThatShouldNotExist) {
                        should.exist(err);
                        err.should.eql(cloudErrors.userNotAuthorisedToPublishError);
                        should.not.exist(cloudThatShouldNotExist);
                        cloudLib.getCloudById(cloud._id, function(err, cloud) {
                            if (err) {
                                return done(err);
                            }
                            should.exist(cloud);
                            cloud.should.have.property('forms').with.lengthOf(1);
                            cloud.forms[0].should.eql(cloudSpecUtil.getForm3Id());
                            done();
                        });
                    });
                });
            });
        });
        it('should copy a form from one cloud to another', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getUser2Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);

                cloudLib.addFormToCloud(cloud._id, cloudSpecUtil.getForm2Id(), function (err, cloud) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(cloud);

                    cloud.should.have.property('forms').with.lengthOf(1);
                    cloud.forms[0].should.eql(cloudSpecUtil.getForm2Id());
                    cloudLib.copyFormToCLoud(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getForm2Id(), function(err, cloud) {
                        if (err) {
                            return done(err);
                        }
                        should.exist(cloud);
                        cloud.should.have.property('forms').with.lengthOf(1);
                        cloudLib.getCloudById(cloudSpecUtil.getCloud1Id(), function(err, cloud) {
                            if (err) {
                                return done(err);
                            }
                            should.exist(cloud);
                            cloud.should.have.property('forms').with.lengthOf(1);
                            cloud.forms[0].should.eql(cloudSpecUtil.getForm2Id());
                            done();
                        });
                    });
                });
            });
        });
        it('should not copy an form from one cloud to another if user is not authorised on cloud', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getUser2Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);

                cloudLib.addFormToCloud(cloud._id, cloudSpecUtil.getForm2Id(), function (err, cloud) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(cloud);

                    cloud.should.have.property('forms').with.lengthOf(1);
                    cloud.forms[0].should.eql(cloudSpecUtil.getForm2Id());
                    cloudLib.copyFormToCLoud(cloudSpecUtil.getCloud4Id(), cloudSpecUtil.getForm2Id(), function(err, cloud) {
                        should.exist(err);
                        should.not.exist(cloud);
                        done();
                    });
                });
            });
        });
    });

    describe('Cloud form retrieval', function () {
        it('should get all forms belonging to a cloud', function (done) {
            cloudLib.addFormToCloud(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getForm2Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);

                cloud._id.should.eql(cloudSpecUtil.getCloud2Id());
                cloud.owner.should.eql(cloudSpecUtil.getUser2Id());

                cloud.should.have.property('forms').with.lengthOf(1);
                cloud.forms[0].should.eql(cloudSpecUtil.getForm2Id());

                cloudLib.getCloudForms(cloudSpecUtil.getCloud2Id(), function (err, forms) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(forms);
                    forms.length.should.equal(1);
                    forms[0]._id.should.eql(cloudSpecUtil.getForm2Id());
                    forms[0].name.should.equal('form2');
                    done();
                });
            });
        });
        it('should get a list of form names belonging to a cloud', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud4Id(), cloudSpecUtil.getUser2Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud4Id(), cloudSpecUtil.getUser3Id(), function (err, cloud) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(cloud);
                    cloudLib.addFormToCloud(cloudSpecUtil.getCloud4Id(), cloudSpecUtil.getForm2Id(), function (err, cloud) {
                        if (err) {
                            return done(err);
                        }
                        should.exist(cloud);
                        cloudLib.addFormToCloud(cloudSpecUtil.getCloud4Id(), cloudSpecUtil.getForm3Id(), function (err, cloud) {
                            if (err) {
                                return done(err);
                            }
                            should.exist(cloud);
                            cloudLib.addFormToCloud(cloudSpecUtil.getCloud4Id(), cloudSpecUtil.getForm4Id(), function (err, cloud) {
                                if (err) {
                                    return done(err);
                                }
                                should.exist(cloud);

                                cloudLib.getCloudFormNames(cloud._id, function (err, names) {
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