var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CloudSchema = new Schema({
    provider: String,
    uid: String,
    displayName: String,
    photo: String,
    created: {type: Date, default: Date.now}
});

var Cloud = mongoose.model('Cloud', CloudSchema);

module.exports = {
    Cloud: Cloud
};