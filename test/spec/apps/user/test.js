/*jslint node: true */
'use strict';
/**
 var util = require('util');
 var mongoose = require( 'mongoose' );
 var Schema = mongoose.Schema;

 // Base cloud. Minimum requirment for an app container.
 function BaseCloudSchema() {
  Schema.apply(this, arguments);

  this.add({
    name: { 
        type: String, 
        required: true,
        unique: true,
        index: true
    },
    apps: [ { 
        type: Schema.Types.ObjectId, 
        ref: 'App' 
    } ],
    description: String,
    icon: String
  });
}
 util.inherits(BaseCloudSchema, Schema);

 // The App Cloud only contians apps. Doesn't need to manage permission like a Standard Cloud
 // and doesn't have an owner like a User Cloud
 var AppCloudSchema = new BaseCloudSchema();

 // When a User is created they get a default cloud
 // THis cloud only contians apps and an owner
 var UserCloudSchema = new BaseCloudSchema({
    owner: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    } 
});

 // Standard Clouds have an owner, apps and permissions lists
 var StandardCloudSchema = new BaseCloudSchema({
    owner: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    menuLabel: String,    
    // TODO: Could mayybe use better validaiton here. Shouldn't be possibel to
    // add a member with write permissin if they are not already in the
    // members list. Currently nothing in place at the Schema leve. 
    // Has to be managed in applicaiton logic.
    members: [ { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    } ],
    membersWithWritePermissions: [ { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    } ]
});

 var AppCloud = mongoose.model('AppCloud', AppCloudSchema);
 var UserCloud = AppCloud.discriminator('UserCloud', UserCloudSchema);
 var Cloud = AppCloud.discriminator('Cloud', StandardCloudSchema);

 module.exports = {
    AppCloud: AppCloud,
    UserCloud: UserCloud,
    Cloud: Cloud
};*/
