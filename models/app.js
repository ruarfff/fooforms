var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AppSchema = new Schema({
    provider: String,
    uid: String,
    displayName: String,
    photo: String,
    created: {type: Date, default: Date.now}
});

var App = mongoose.model('App', AppSchema);

module.exports = {
    App: App
};