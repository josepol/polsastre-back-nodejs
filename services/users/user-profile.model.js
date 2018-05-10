'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserProfileSchema = new Schema({
    name: String,
    username: String
});

module.exports = mongoose.model('UserProfileModel', UserProfileSchema);