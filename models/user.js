var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    provider: String,
    uid: String,
    displayName: String,
    photo: String,
    created: { type: Date, default: Date.now }
});

var User = mongoose.model('User', UserSchema);

module.exports = {
    User: User
};