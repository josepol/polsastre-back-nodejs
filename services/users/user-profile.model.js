var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserProfileSchema = new Schema({
    name: String,
    username: String
});

module.exports = mongoose.model('UserProfileModel', UserProfileSchema);